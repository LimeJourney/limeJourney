export type MessagingIntegration = {
  id: string;
  name: string;
  type: string;
  providerName: string;
  requiredFields: Record<string, string>;
  confidentialFields: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
};
