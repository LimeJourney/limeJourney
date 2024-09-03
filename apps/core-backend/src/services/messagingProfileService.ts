import { PrismaClient, MessagingProfile, Prisma } from "@prisma/client";
import { AppError } from "@lime/errors";
import * as crypto from "crypto";

const prisma = new PrismaClient();

export class MessagingProfileService {
  private encryptionKey: Buffer;

  constructor() {
    this.encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY || "", "hex");
  }

  private encryptValue(value: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", this.encryptionKey, iv);
    let encrypted = cipher.update(value, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  }

  private decryptValue(encryptedData: string): string {
    const [ivHex, encryptedHex] = encryptedData.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      this.encryptionKey,
      iv
    );
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  private encryptCredentials(
    credentials: Record<string, string>
  ): Prisma.JsonObject {
    return Object.fromEntries(
      Object.entries(credentials).map(([key, value]) => [
        key,
        this.encryptValue(value),
      ])
    );
  }

  private decryptCredentials(
    encryptedCredentials: Prisma.JsonValue
  ): Record<string, string> {
    if (
      typeof encryptedCredentials !== "object" ||
      encryptedCredentials === null
    ) {
      throw new Error("Invalid credentials format");
    }
    return Object.fromEntries(
      Object.entries(encryptedCredentials).map(([key, value]) => [
        key,
        this.decryptValue(value as string),
      ])
    );
  }

  async createProfile(
    data: Omit<MessagingProfile, "id" | "createdAt" | "updatedAt"> & {
      credentials: Record<string, string>;
    }
  ): Promise<MessagingProfile> {
    try {
      const integration = await prisma.messagingIntegration.findUnique({
        where: { id: data.integrationId },
      });

      if (!integration) {
        throw new AppError(
          "Invalid integration ID",
          400,
          "INVALID_INTEGRATION"
        );
      }

      const requiredFields = integration.requiredFields as string[];
      const providedFields = Object.keys(data.credentials);

      const missingFields = requiredFields.filter(
        (field) => !providedFields.includes(field)
      );
      if (missingFields.length > 0) {
        throw new AppError(
          `Missing required fields: ${missingFields.join(", ")}`,
          400,
          "MISSING_REQUIRED_FIELDS"
        );
      }

      const encryptedCredentials = this.encryptCredentials(data.credentials);

      const profile = await prisma.messagingProfile.create({
        data: {
          ...data,
          credentials: encryptedCredentials,
        },
      });

      return {
        ...profile,
        credentials: this.decryptCredentials(profile.credentials),
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to create messaging profile",
        500,
        "PROFILE_CREATE_ERROR"
      );
    }
  }

  async getProfiles(organizationId: string): Promise<MessagingProfile[]> {
    try {
      const profiles = await prisma.messagingProfile.findMany({
        where: { organizationId },
        include: { integration: true },
      });

      return profiles.map((profile) => ({
        ...profile,
        credentials: this.decryptCredentials(profile.credentials),
      }));
    } catch (error) {
      throw new AppError(
        "Failed to fetch messaging profiles",
        500,
        "PROFILE_FETCH_ERROR"
      );
    }
  }

  async getProfileById(
    id: string,
    organizationId: string
  ): Promise<MessagingProfile | null> {
    try {
      const profile = await prisma.messagingProfile.findFirst({
        where: { id, organizationId },
        include: { integration: true },
      });

      if (!profile) return null;

      return {
        ...profile,
        credentials: this.decryptCredentials(profile.credentials),
      };
    } catch (error) {
      throw new AppError(
        "Failed to fetch messaging profile",
        500,
        "PROFILE_FETCH_ERROR"
      );
    }
  }

  async updateProfile(
    id: string,
    organizationId: string,
    data: Partial<Omit<MessagingProfile, "id" | "createdAt" | "updatedAt">> & {
      credentials?: Record<string, string>;
    }
  ): Promise<MessagingProfile> {
    try {
      const updateData: Prisma.MessagingProfileUpdateInput = { ...data };

      if (data.credentials) {
        updateData.credentials = this.encryptCredentials(data.credentials);
      }

      const updatedProfile = await prisma.messagingProfile.update({
        where: { id_organizationId: { id, organizationId } },
        data: updateData,
      });

      return {
        ...updatedProfile,
        credentials: this.decryptCredentials(updatedProfile.credentials),
      };
    } catch (error) {
      throw new AppError(
        "Failed to update messaging profile",
        500,
        "PROFILE_UPDATE_ERROR"
      );
    }
  }

  async deleteProfile(id: string, organizationId: string): Promise<void> {
    try {
      await prisma.messagingProfile.delete({
        where: { id_organizationId: { id, organizationId } },
      });
    } catch (error) {
      throw new AppError(
        "Failed to delete messaging profile",
        500,
        "PROFILE_DELETE_ERROR"
      );
    }
  }
}
