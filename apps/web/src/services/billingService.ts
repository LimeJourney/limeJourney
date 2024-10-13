import { apiCall } from "./baseService";

export const BillingService = {
  async createCheckoutSession(): Promise<string> {
    const response = await apiCall<{ url: string }>(
      "post",
      "/billing/create-checkout-session"
    );
    return response.url;
  },

  async createPortalSession(): Promise<string> {
    const response = await apiCall<{ url: string }>(
      "post",
      "/billing/create-portal-session"
    );
    return response.url;
  },
  async getSubscriptionEnforcement(): Promise<boolean> {
    const response = await apiCall<{ enforced: boolean }>(
      "get",
      "/billing/subscription-enforcement"
    );
    return response.enforced;
  },
};
