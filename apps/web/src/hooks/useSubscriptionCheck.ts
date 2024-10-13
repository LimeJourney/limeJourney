import { useSubscription } from "@/app/contexts/SubscriptionContext";
import { OrganizationService } from "@/services/organisationService";
import { useCallback } from "react";

export const useSubscriptionCheck = () => {
  const { setShowSubscriptionModal } = useSubscription();

  const checkSubscription = useCallback(async () => {
    try {
      const org = await OrganizationService.getCurrentOrganization();
      if (!org || org.subscriptionStatus !== "ACTIVE") {
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
