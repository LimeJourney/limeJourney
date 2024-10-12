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
import { CreditCard, Users, CalendarDays, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LoadingPage from "../../loading";

// Define types
type SubscriptionStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PAST_DUE"
  | "CANCELLED"
  | "CANCELLING";

interface Subscription {
  planName: string;
  status: SubscriptionStatus;
  quantity: number;
  nextBillingDate: string;
  cancelAtPeriodEnd: boolean;
}

// Dummy data
const dummySubscription: Subscription = {
  planName: "Pro Plan",
  status: "ACTIVE",
  quantity: 5,
  nextBillingDate: "2023-12-01",
  cancelAtPeriodEnd: false,
};

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
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      setSubscription(dummySubscription);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = () => {
    alert("Redirecting to Stripe Checkout...");
    // In a real implementation, this would create a Checkout session and redirect
  };

  const handleManageSubscription = () => {
    alert("Redirecting to Stripe Customer Portal...");
    // In a real implementation, this would create a Customer Portal session and redirect
  };

  if (isLoading) {
    return <LoadingPage />;
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
                    <span>Renews {subscription.nextBillingDate}</span>
                  </div>
                </div>
                {subscription.cancelAtPeriodEnd && (
                  <p className="mt-4 text-red-400 font-semibold">
                    Your subscription will end on {subscription.nextBillingDate}
                  </p>
                )}
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
              >
                Manage Subscription
              </Button>
            ) : (
              <Button
                onClick={handleSubscribe}
                className="bg-meadow-500 text-forest-700 hover:bg-meadow-600"
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
