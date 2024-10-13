import { useSubscription } from "@/app/contexts/SubscriptionContext";
import { BillingService } from "@/services/billingService";
import { OrganizationService } from "@/services/organisationService";
import { useCallback } from "react";

export const useSubscriptionCheck = () => {
  const { setShowSubscriptionModal } = useSubscription();

  const checkSubscription = useCallback(async () => {
    try {
      const org = await OrganizationService.getCurrentOrganization();
      const enforced = await BillingService.getSubscriptionEnforcement();
      if (!org || (org.subscriptionStatus !== "ACTIVE" && enforced)) {
        setShowSubscriptionModal(true);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error checking subscription:", error);
      setShowSubscriptionModal(true);
      return false;
    }
  }, [setShowSubscriptionModal]);

  return checkSubscription;
};
