"use client";
import React, { useState } from "react";
import { X, Check, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BillingService } from "@/services/billingService";
import { toast } from "@/components/ui/use-toast";

const SubscriptionModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const pricingPlan = {
    name: "Pro",
    price: 50,
    billingPeriod: "month",
    features: [
      "Unlimited projects",
      "20,000 unique entities",
      "Priority support",
      "API access",
      "Advanced analytics",
    ],
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const checkoutUrl = await BillingService.createCheckoutSession();
      window.location.href = checkoutUrl;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-forest-700 border-meadow-500 text-meadow-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-meadow-300">
            Subscribe to Unlock Premium Features
          </DialogTitle>
          <Button
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-forest-700 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-meadow-300 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-forest-600"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-meadow-300 mb-2">
              {pricingPlan.name} Plan
            </h3>
            <div className="flex items-baseline mb-4">
              <span className="text-4xl font-bold text-meadow-100">
                ${pricingPlan.price}
              </span>
              <span className="text-lg ml-2 text-meadow-400">
                /{pricingPlan.billingPeriod}
              </span>
            </div>
          </div>
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-meadow-300 mb-3">
              Features:
            </h4>
            <ul className="grid grid-cols-1 gap-2">
              {pricingPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-meadow-100">
                  <Check className="w-5 h-5 mr-3 text-meadow-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full py-2 px-4 bg-meadow-500 text-forest-900 text-lg font-semibold rounded-md hover:bg-meadow-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-meadow-300 focus:ring-opacity-50 flex items-center justify-center group"
          >
            {isLoading ? "Processing..." : "Subscribe Now"}
            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
