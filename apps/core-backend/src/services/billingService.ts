import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import { AppConfig } from "@lime/config";

const prisma = new PrismaClient();
const stripe = new Stripe(AppConfig.stripe.secretKey || "");

export class BillingService {
  async createCheckoutSession(organizationId: string): Promise<string> {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: { members: true },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    let stripeCustomerId = organization.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        metadata: { organizationId: organization.id },
      });
      stripeCustomerId = customer.id;
      await prisma.organization.update({
        where: { id: organizationId },
        data: { stripeCustomerId: stripeCustomerId },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: AppConfig.stripe.priceId,
          quantity: organization.members.length,
        },
      ],
      success_url: `${AppConfig.appUrl}/dashboard/settings/billing`,
      cancel_url: `${AppConfig.appUrl}/dashboard/settings/billing`,
      client_reference_id: organizationId,
    });

    return session.url!;
  }

  async createPortalSession(organizationId: string): Promise<string> {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization || !organization.stripeCustomerId) {
      throw new Error("Organization not found or not subscribed");
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: organization.stripeCustomerId,
      return_url: `${AppConfig.appUrl}/dashboard/settings/billing`,
    });

    return portalSession.url;
  }

  async handleWebhook(
    signature: string,
    payload: string
  ): Promise<{ received: boolean }> {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        AppConfig.stripe.webhookSecret
      );
    } catch (err) {
      console.error(`Webhook signature verification failed.`);
      throw new Error("Invalid signature");
    }

    switch (event.type) {
      case "checkout.session.completed":
        await this.handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      case "invoice.paid":
        await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await this.handleInvoicePaymentFailed(
          event.data.object as Stripe.Invoice
        );
        break;
      // Add more event handlers as needed
    }

    return { received: true };
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session
  ) {
    if (
      session.client_reference_id &&
      session.subscription &&
      typeof session.subscription === "string"
    ) {
      await prisma.organization.update({
        where: { id: session.client_reference_id },
        data: {
          subscriptionId: session.subscription,
          subscriptionStatus: "ACTIVE",
        },
      });
    }
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice) {
    if (invoice.customer && typeof invoice.customer === "string") {
      const organization = await prisma.organization.findFirst({
        where: { stripeCustomerId: invoice.customer },
      });
      if (organization) {
        await prisma.organization.update({
          where: { id: organization.id },
          data: {
            subscriptionStatus: "ACTIVE",
            subscriptionPeriodEnd: new Date(invoice.period_end * 1000),
          },
        });
      }
    }
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    if (invoice.customer && typeof invoice.customer === "string") {
      const organization = await prisma.organization.findFirst({
        where: { stripeCustomerId: invoice.customer },
      });
      if (organization) {
        await prisma.organization.update({
          where: { id: organization.id },
          data: {
            subscriptionStatus: "PAST_DUE",
          },
        });
      }
    }
  }
}
