import { PrismaClient, MessagingIntegration, Prisma } from "@prisma/client";
import { AppError } from "@lime/errors";

const prisma = new PrismaClient();

type AvailableIntegration = Pick<
  MessagingIntegration,
  "id" | "name" | "type" | "providerName"
> & {
  requiredFields: string[];
  confidentialFields: string[];
};

export interface IntegrationFields {
  requiredFields: string[];
  confidentialFields: string[];
}

export class MessagingIntegrationService {
  async getAvailableIntegrations(): Promise<AvailableIntegration[]> {
    try {
      const integrations = await prisma.messagingIntegration.findMany({
        select: {
          id: true,
          name: true,
          type: true,
          providerName: true,
          requiredFields: true,
          confidentialFields: true,
        },
      });

      return integrations.map((integration) => ({
        ...integration,
        requiredFields: JSON.parse(integration.requiredFields as string),
        confidentialFields: JSON.parse(
          integration.confidentialFields as string
        ),
      }));
    } catch (error) {
      throw new AppError(
        "Failed to fetch available integrations",
        500,
        "INTEGRATION_FETCH_ERROR"
      );
    }
  }

  async createIntegration(
    data: Omit<
      Prisma.MessagingIntegrationCreateInput,
      "requiredFields" | "confidentialFields"
    > &
      IntegrationFields
  ): Promise<MessagingIntegration> {
    try {
      const { requiredFields, confidentialFields, ...rest } = data;
      const createdIntegration = await prisma.messagingIntegration.create({
        data: {
          ...rest,
          requiredFields: JSON.stringify(requiredFields),
          confidentialFields: JSON.stringify(confidentialFields),
        },
      });

      return {
        ...createdIntegration,
        requiredFields: requiredFields,
        confidentialFields: confidentialFields,
      } as MessagingIntegration;
    } catch (error) {
      throw new AppError(
        "Failed to create messaging integration",
        500,
        "INTEGRATION_CREATE_ERROR"
      );
    }
  }

  async getIntegrations(): Promise<MessagingIntegration[]> {
    try {
      const integrations = await prisma.messagingIntegration.findMany();
      return integrations.map((integration) => ({
        ...integration,
        requiredFields: JSON.parse(integration.requiredFields as string),
        confidentialFields: JSON.parse(
          integration.confidentialFields as string
        ),
      }));
    } catch (error) {
      throw new AppError(
        "Failed to fetch messaging integrations",
        500,
        "INTEGRATION_FETCH_ERROR"
      );
    }
  }

  async updateIntegration(
    id: string,
    data: Partial<
      Omit<
        Prisma.MessagingIntegrationUpdateInput,
        "requiredFields" | "confidentialFields"
      > &
        Partial<IntegrationFields>
    >
  ): Promise<MessagingIntegration> {
    try {
      const { requiredFields, confidentialFields, ...rest } = data;
      const updateData: Prisma.MessagingIntegrationUpdateInput = {
        ...rest,
      };
      if (requiredFields) {
        updateData.requiredFields = JSON.stringify(requiredFields);
      }
      if (confidentialFields) {
        updateData.confidentialFields = JSON.stringify(confidentialFields);
      }
      const updatedIntegration = await prisma.messagingIntegration.update({
        where: { id },
        data: updateData,
      });
      return {
        ...updatedIntegration,
        requiredFields: JSON.parse(updatedIntegration.requiredFields as string),
        confidentialFields: JSON.parse(
          updatedIntegration.confidentialFields as string
        ),
      };
    } catch (error) {
      throw new AppError(
        "Failed to update messaging integration",
        500,
        "INTEGRATION_UPDATE_ERROR"
      );
    }
  }

  async deleteIntegration(id: string): Promise<void> {
    try {
      await prisma.messagingIntegration.delete({ where: { id } });
    } catch (error) {
      throw new AppError(
        "Failed to delete messaging integration",
        500,
        "INTEGRATION_DELETE_ERROR"
      );
    }
  }
}
