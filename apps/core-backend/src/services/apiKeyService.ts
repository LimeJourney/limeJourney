import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  organizationId: string;
  createdAt: Date;
  lastUsedAt: Date | null;
  expiresAt: Date | null;
  isActive: boolean;
}

export class ApiKeyService {
  async generateApiKey(organizationId: string, name: string): Promise<ApiKey> {
    const key = `pk_${crypto.randomBytes(24).toString("hex")}`;
    return prisma.apiKey.create({
      data: {
        name,
        key,
        organizationId,
      },
    });
  }

  async getApiKeys(organizationId: string): Promise<ApiKey[]> {
    return prisma.apiKey.findMany({
      where: { organizationId, isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async deleteApiKey(id: string, organizationId: string): Promise<void> {
    await prisma.apiKey.deleteMany({
      where: { id, organizationId },
    });
  }

  async validateApiKey(key: string): Promise<boolean> {
    const apiKey = await prisma.apiKey.findUnique({
      where: { key },
      include: { organization: true },
    });

    if (
      !apiKey ||
      !apiKey.isActive ||
      (apiKey.expiresAt && apiKey.expiresAt < new Date())
    ) {
      return false;
    }

    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return true;
  }
}
