"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Users,
  CalendarDays,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LoadingPage from "../../loading";
import { BillingService } from "@/services/billingService";
import {
  OrganizationService,
  Organization,
  OrganizationMember,
  SubscriptionStatus,
} from "@/services/organisationService";
import { toast } from "@/components/ui/use-toast";
import { authService } from "@/services/authService";

const StatusIndicator: React.FC<{ status: SubscriptionStatus }> = ({
  status,
}) => {
  const statusConfig = {
    ACTIVE: { color: "bg-meadow-500", text: "text-forest-700" },
    INACTIVE: { color: "bg-red-500", text: "text-white" },
    PAST_DUE: { color: "bg-yellow-500", text: "text-forest-700" },
    CANCELLED: { color: "bg-red-500", text: "text-white" },
    CANCELLING: { color: "bg-yellow-500", text: "text-forest-700" },
  };
  const { color, text } = statusConfig[status];

  return (
    <Badge variant="outline" className={`${color} ${text}`}>
      {status}
    </Badge>
  );
};

export default function SubscriptionPage() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionEnforced, setSubscriptionEnforced] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [org, enforced, currentUser] = await Promise.all([
        OrganizationService.getCurrentOrganization(),
        BillingService.getSubscriptionEnforcement(),
        authService.getCurrentUser(),
      ]);

      setSubscriptionEnforced(enforced);
      setUserRole(currentUser.data.role);

      if (org) {
        setOrganization(org);
        const orgMembers = await OrganizationService.getOrganizationMembers(
          org.id
        );
        setMembers(orgMembers);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching data",
        description:
          "There was a problem retrieving your organization details.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      const checkoutUrl = await BillingService.createCheckoutSession();
      window.location.href = checkoutUrl;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
      });
    }
  };

  const handleManageSubscription = async () => {
    try {
      const portalUrl = await BillingService.createPortalSession();
      window.location.href = portalUrl;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to open customer portal. Please try again.",
      });
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  console.log("User Role", userRole);
  const isAdmin = userRole === "ADMIN";
  const subscription = organization?.subscriptionId
    ? {
        status: organization.subscriptionStatus,
        nextBillingDate: organization.subscriptionPeriodEnd,
        quantity: members.length,
        planName: organization.planId || "Pro",
      }
    : null;

  if (!subscriptionEnforced) {
    return (
      <div className="bg-forest-500 min-h-screen text-meadow-100 flex items-center justify-center">
        <Card className="bg-forest-700 border-meadow-500 max-w-md">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-meadow-100">
              Subscriptions Not Enforced
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-meadow-300">
              Subscriptions are currently not being enforced. All features are
              available without a subscription.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-forest-500 min-h-screen text-meadow-100">
      <header className="bg-forest-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-semibold text-meadow-100">
            Subscription
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAdmin && (
          <div className="bg-yellow-500 text-forest-700 p-4 rounded-md mb-6">
            <AlertTriangle className="inline-block mr-2" />
            You have read-only access. Please contact your organization admin
            for any changes.
          </div>
        )}
        <Card className="bg-forest-700 border-meadow-500">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-meadow-100">
              {subscription ? "Current Plan" : "Subscribe to a Plan"}
            </h2>
          </CardHeader>
          <CardContent className="p-6">
            {subscription ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-3xl font-bold text-meadow-100">
                      {subscription.planName}
                    </h3>
                    <p className="text-meadow-300 mt-1">
                      ${50 * subscription.quantity} per month
                    </p>
                  </div>
                  <StatusIndicator status={subscription.status} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-meadow-300">
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-meadow-400" />
                    <span>{subscription.quantity} seats</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarDays className="mr-2 h-5 w-5 text-meadow-400" />
                    <span>
                      Renews{" "}
                      {subscription.nextBillingDate
                        ? new Date(
                            subscription.nextBillingDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-meadow-300">
                You are not currently subscribed to any plan. Click the button
                below to choose a plan and subscribe.
              </p>
            )}
          </CardContent>
          <CardFooter className="bg-forest-700 border-t border-meadow-500 p-4">
            {subscription ? (
              <Button
                onClick={handleManageSubscription}
                className="bg-meadow-500 text-forest-700 hover:bg-meadow-600"
                disabled={!isAdmin}
              >
                Manage Subscription
              </Button>
            ) : (
              <Button
                onClick={handleSubscribe}
                className="bg-meadow-500 text-forest-700 hover:bg-meadow-600"
                disabled={!isAdmin}
              >
                Subscribe Now
              </Button>
            )}
          </CardFooter>
        </Card>

        {subscription && (
          <Card className="mt-8 bg-forest-700 border-meadow-500">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-meadow-100">
                Quick Actions
              </h2>
            </CardHeader>
            <CardContent className="p-0">
              <button
                onClick={handleManageSubscription}
                className="w-full p-4 text-left hover:bg-forest-600 transition-colors duration-200 flex items-center group"
                disabled={!isAdmin}
              >
                <CreditCard className="mr-3 h-5 w-5 text-meadow-400 group-hover:text-meadow-300" />
                <span className="text-meadow-100 group-hover:text-meadow-50">
                  Manage billing and invoices
                </span>
              </button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Help Tooltip */}
      <div className="fixed bottom-4 right-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="rounded-full bg-meadow-500 text-forest-700 hover:bg-meadow-600"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="max-w-sm bg-forest-600 text-meadow-100 border-meadow-500"
            >
              <p>
                Need help managing your subscription? Click here for a quick
                guide.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
