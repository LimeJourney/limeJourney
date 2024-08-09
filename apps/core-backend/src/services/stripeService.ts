import Stripe from "stripe";
import {
  PrismaClient,
  Organization,
  SubscriptionStatus,
  UserRole,
} from "@prisma/client";

export class StripeService {
  private stripe: Stripe;
  private prisma: PrismaClient;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    this.prisma = new PrismaClient();
  }

  async createCustomer(organizationId: string, email: string): Promise<string> {
    const customer = await this.stripe.customers.create({
      email,
      metadata: { organizationId },
    });

    return customer.id;
  }

  async createSubscription(
    organizationId: string,
    priceId: string,
    quantity: number
  ): Promise<Stripe.Subscription> {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        members: { include: { user: true }, where: { role: UserRole.ADMIN } },
      },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    let customerId = organization.subscriptionId;

    if (!customerId) {
      const adminUser = organization.members[0]?.user;
      if (!adminUser) {
        throw new Error("No admin user found for the organization");
      }
      customerId = await this.createCustomer(organizationId, adminUser.email);
    }

    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId, quantity }],
    });

    await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        subscriptionId: subscription.id,
        subscriptionStatus: this.mapStripeStatusToPrismaStatus(
          subscription.status
        ),
        planId: priceId,
        subscriptionPeriodStart: new Date(
          subscription.current_period_start * 1000
        ),
        subscriptionPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });

    return subscription;
  }

  async getSubscription(
    organizationId: string
  ): Promise<Stripe.Subscription | null> {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization || !organization.subscriptionId) {
      return null;
    }

    return await this.stripe.subscriptions.retrieve(
      organization.subscriptionId
    );
  }

  async updateSubscriptionQuantity(
    organizationId: string,
    newQuantity: number
  ): Promise<Stripe.Subscription> {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization || !organization.subscriptionId) {
      throw new Error("Organization or subscription not found");
    }

    const subscription = await this.stripe.subscriptions.retrieve(
      organization.subscriptionId
    );
    const subscriptionItem = subscription.items.data[0];

    const updatedSubscription = await this.stripe.subscriptions.update(
      subscription.id,
      {
        items: [{ id: subscriptionItem.id, quantity: newQuantity }],
      }
    );

    await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        subscriptionStatus: this.mapStripeStatusToPrismaStatus(
          updatedSubscription.status
        ),
        subscriptionPeriodStart: new Date(
          updatedSubscription.current_period_start * 1000
        ),
        subscriptionPeriodEnd: new Date(
          updatedSubscription.current_period_end * 1000
        ),
      },
    });

    return updatedSubscription;
  }

  async getInvoices(organizationId: string): Promise<Stripe.Invoice[]> {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization || !organization.subscriptionId) {
      throw new Error("Organization or subscription not found");
    }

    const invoices = await this.stripe.invoices.list({
      customer: organization.subscriptionId,
    });

    return invoices.data;
  }

  async createCheckoutSession(
    organizationId: string,
    priceId: string,
    quantity: number
  ): Promise<string> {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        members: { include: { user: true }, where: { role: UserRole.ADMIN } },
      },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    const adminUser = organization.members[0]?.user;
    if (!adminUser) {
      throw new Error("No admin user found for the organization");
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity }],
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      customer_email: adminUser.email,
      client_reference_id: organizationId,
    });

    return session.id;
  }

  async handleWebhook(body: string, signature: string): Promise<void> {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      throw new Error(`Webhook Error: ${(err as Error).message}`);
    }

    switch (event.type) {
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        const subscription = event.data.object as Stripe.Subscription;
        await this.updateOrganizationSubscription(subscription);
        break;
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        await this.handleCheckoutSessionCompleted(session);
        break;
    }
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session
  ): Promise<void> {
    if (!session.client_reference_id) {
      throw new Error("No client_reference_id found in the checkout session");
    }

    const subscriptionId = session.subscription as string;
    const subscription =
      await this.stripe.subscriptions.retrieve(subscriptionId);

    await this.prisma.organization.update({
      where: { id: session.client_reference_id },
      data: {
        subscriptionId: subscriptionId,
        subscriptionStatus: this.mapStripeStatusToPrismaStatus(
          subscription.status
        ),
        planId: subscription.items.data[0].price.id,
        subscriptionPeriodStart: new Date(
          subscription.current_period_start * 1000
        ),
        subscriptionPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  }

  async getDetailedSubscriptionStatus(organizationId: string): Promise<{
    status: SubscriptionStatus;
    isActive: boolean;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: Date | null;
    planId: string | null;
  }> {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    if (!organization.subscriptionId) {
      return {
        status: "INACTIVE",
        isActive: false,
        cancelAtPeriodEnd: false,
        currentPeriodEnd: null,
        planId: null,
      };
    }

    const subscription = await this.stripe.subscriptions.retrieve(
      organization.subscriptionId
    );

    const status = this.mapStripeStatusToPrismaStatus(subscription.status);
    const isActive = status === "ACTIVE" || status === "PAST_DUE";
    const cancelAtPeriodEnd = subscription.cancel_at_period_end;
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

    return {
      status,
      isActive,
      cancelAtPeriodEnd,
      currentPeriodEnd,
      planId: organization.planId,
    };
  }

  async cancelSubscription(organizationId: string): Promise<void> {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization || !organization.subscriptionId) {
      throw new Error("Organization or subscription not found");
    }

    const updatedSubscription = await this.stripe.subscriptions.update(
      organization.subscriptionId,
      { cancel_at_period_end: true }
    );

    await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        subscriptionStatus: this.mapStripeStatusToPrismaStatus(
          updatedSubscription.status
        ),
      },
    });
  }

  private async updateOrganizationSubscription(
    subscription: Stripe.Subscription
  ): Promise<void> {
    const organization = await this.prisma.organization.findFirst({
      where: { subscriptionId: subscription.id },
    });

    if (!organization) {
      throw new Error("Organization not found for the given subscription");
    }

    await this.prisma.organization.update({
      where: { id: organization.id },
      data: {
        subscriptionStatus: this.mapStripeStatusToPrismaStatus(
          subscription.status
        ),
        subscriptionPeriodStart: new Date(
          subscription.current_period_start * 1000
        ),
        subscriptionPeriodEnd: new Date(subscription.current_period_end * 1000),
        // If the subscription has ended, clear these fields
        ...(subscription.status === "canceled" && {
          subscriptionId: null,
          planId: null,
        }),
      },
    });
  }

  private mapStripeStatusToPrismaStatus(
    stripeStatus: string
  ): SubscriptionStatus {
    switch (stripeStatus) {
      case "active":
        return "ACTIVE";
      case "past_due":
        return "PAST_DUE";
      case "canceled":
        return "CANCELLED";
      case "unpaid":
        return "PAST_DUE";
      default:
        return "INACTIVE";
    }
  }
}
