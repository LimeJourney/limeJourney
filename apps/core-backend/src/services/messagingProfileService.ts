import {
  PrismaClient,
  MessagingProfile,
  Prisma,
  MessagingIntegration,
} from "@prisma/client";
import { AppError } from "@lime/errors";
import * as crypto from "crypto";

const prisma = new PrismaClient();

export class MessagingProfileService {
  private encryptionKey: Buffer;

  constructor() {
    this.encryptionKey = Buffer.from(
      // TODO: move to env
      process.env.ENCRYPTION_KEY ||
        "5ebe2294ecd0e0f08eab7690d2a6ee69f9e5da618d6fea9f7c3d04c0cb180fc1",
      "hex"
    );
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
    credentials: Record<string, string>,
    confidentialFields: string[]
  ): Prisma.JsonObject {
    return Object.fromEntries(
      Object.entries(credentials).map(([key, value]) => [
        key,
        confidentialFields.includes(key) ? this.encryptValue(value) : value,
      ])
    );
  }

  private decryptCredentials(
    encryptedCredentials: Prisma.JsonValue,
    confidentialFields: string[]
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
        confidentialFields.includes(key)
          ? this.decryptValue(value as string)
          : (value as string),
      ])
    );
  }

  async createProfile(
    data: Omit<MessagingProfile, "id" | "createdAt" | "updatedAt"> & {
      requiredFields: Record<string, string>;
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

      const integrationRequiredFields = JSON.parse(
        integration.requiredFields as string
      ) as string[];
      const confidentialFields = JSON.parse(
        integration.confidentialFields as string
      ) as string[];

      // Combine all required fields
      const allRequiredFields = [
        ...new Set([...integrationRequiredFields, ...confidentialFields]),
      ];

      // Check if all required fields are provided
      const missingFields = allRequiredFields.filter(
        (field) =>
          !(field in data.requiredFields) && !(field in data.credentials)
      );

      if (missingFields.length > 0) {
        throw new AppError(
          `Missing required fields: ${missingFields.join(", ")}`,
          400,
          "MISSING_REQUIRED_FIELDS"
        );
      }

      // Ensure confidential fields are in credentials, not in requiredFields
      const misplacedConfidentialFields = confidentialFields.filter(
        (field) => field in data.requiredFields
      );

      if (misplacedConfidentialFields.length > 0) {
        throw new AppError(
          `Confidential fields found in requiredFields: ${misplacedConfidentialFields.join(", ")}. Please move them to credentials.`,
          400,
          "MISPLACED_CONFIDENTIAL_FIELDS"
        );
      }

      const encryptedCredentials = this.encryptCredentials(
        data.credentials,
        confidentialFields
      );

      const profile = await prisma.messagingProfile.create({
        data: {
          ...data,
          requiredFields: data.requiredFields,
          credentials: encryptedCredentials,
          status: "active",
        },
        include: { integration: true },
      });

      return {
        ...profile,
        credentials: {},
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
        integration: {
          ...profile.integration,
          confidentialFields: JSON.parse(
            profile.integration.confidentialFields as string
          ),
          requiredFields: JSON.parse(
            profile.integration.requiredFields as string
          ),
        },
        credentials: {},
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
        credentials: {},
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
    data: Partial<
      Omit<
        MessagingProfile,
        "id" | "createdAt" | "updatedAt" | "requiredFields" | "credentials"
      >
    > & {
      requiredFields?: Record<string, string>;
      credentials?: Record<string, string>;
    }
  ): Promise<MessagingProfile> {
    try {
      const existingProfile = await prisma.messagingProfile.findUnique({
        where: { id_organizationId: { id, organizationId } },
        include: { integration: true },
      });

      if (!existingProfile) {
        throw new AppError("Profile not found", 404, "PROFILE_NOT_FOUND");
      }

      const confidentialFields = JSON.parse(
        existingProfile.integration.confidentialFields as string
      ) as string[];
      const updateData: Prisma.MessagingProfileUpdateInput = { ...data };

      if (data.requiredFields) {
        const existingRequiredFields =
          (existingProfile.requiredFields as Record<string, string>) || {};
        updateData.requiredFields = {
          ...existingRequiredFields,
          ...data.requiredFields,
        };
      }

      if (data.credentials) {
        const existingCredentials = this.decryptCredentials(
          existingProfile.credentials as Prisma.JsonObject,
          confidentialFields
        );
        const updatedCredentials = {
          ...existingCredentials,
          ...data.credentials,
        };
        updateData.credentials = this.encryptCredentials(
          updatedCredentials,
          confidentialFields
        );
      }

      const updatedProfile = await prisma.messagingProfile.update({
        where: { id_organizationId: { id, organizationId } },
        data: updateData,
        include: { integration: true },
      });

      return {
        ...updatedProfile,
        credentials: {},
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
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

  async getProfileWithCredentials(
    id: string,
    organizationId: string
  ): Promise<MessagingProfile | null> {
    try {
      const profile = await prisma.messagingProfile.findFirst({
        where: { id, organizationId },
        include: { integration: true },
      });

      if (!profile) return null;

      const confidentialFields = JSON.parse(
        profile.integration.confidentialFields as string
      ) as string[];

      const decryptedCredentials = this.decryptCredentials(
        profile.credentials as Prisma.JsonObject,
        confidentialFields
      );

      return {
        ...profile,
        credentials: decryptedCredentials,
      };
    } catch (error) {
      throw new AppError(
        "Failed to fetch messaging profile with credentials",
        500,
        "PROFILE_FETCH_ERROR"
      );
    }
  }
}
