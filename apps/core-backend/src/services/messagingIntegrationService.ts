import { PrismaClient, MessagingIntegration, Prisma } from "@prisma/client";
import { AppError } from "@lime/errors";

const prisma = new PrismaClient();

// Define a new type for the subset of fields returned by getAvailableIntegrations
type AvailableIntegration = Pick<
  MessagingIntegration,
  "id" | "name" | "type" | "providerName" | "requiredFields"
>;

export class MessagingIntegrationService {
  async getAvailableIntegrations(): Promise<AvailableIntegration[]> {
    try {
      return await prisma.messagingIntegration.findMany({
        select: {
          id: true,
          name: true,
          type: true,
          providerName: true,
          requiredFields: true,
        },
      });
    } catch (error) {
      throw new AppError(
        "Failed to fetch available integrations",
        500,
        "INTEGRATION_FETCH_ERROR"
      );
    }
  }

  async createIntegration(
    data: Prisma.MessagingIntegrationCreateInput
  ): Promise<MessagingIntegration> {
    try {
      return await prisma.messagingIntegration.create({ data });
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
      return await prisma.messagingIntegration.findMany();
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
    data: Prisma.MessagingIntegrationUpdateInput
  ): Promise<MessagingIntegration> {
    try {
      return await prisma.messagingIntegration.update({
        where: { id },
        data,
      });
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
