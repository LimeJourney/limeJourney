import { MessagingProfileService } from "../../services/messagingProfileService";
import {
  PrismaClient,
  MessagingProfile,
  MessagingIntegration,
  Prisma,
} from "@prisma/client";
import { AppError } from "@lime/errors";
import { mockDeep, MockProxy } from "jest-mock-extended";

type MockPrismaClient = MockProxy<PrismaClient> & {
  messagingIntegration: {
    findUnique: jest.Mock;
  };
  messagingProfile: {
    create: jest.Mock;
    findMany: jest.Mock;
    findFirst: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(),
}));

describe("MessagingProfileService", () => {
  let service: MessagingProfileService;
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ENCRYPTION_KEY = "test-encryption-key";
    mockPrisma = mockDeep<PrismaClient>() as MockPrismaClient;
    (PrismaClient as jest.Mock).mockReturnValue(mockPrisma);
    service = new MessagingProfileService();
  });

  describe("createProfile", () => {
    it("should create a messaging profile successfully", async () => {
      const mockIntegration: MessagingIntegration = {
        id: "1",
        name: "Test Integration",
        type: "email",
        providerName: "TestProvider",
        requiredFields: JSON.stringify(["field1", "field2"]),
        confidentialFields: JSON.stringify(["field2"]),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockProfileData: Omit<
        MessagingProfile,
        "id" | "createdAt" | "updatedAt"
      > & {
        requiredFields: Record<string, string>;
        credentials: Record<string, string>;
      } = {
        name: "Test Profile",
        integrationId: "1",
        organizationId: "org1",
        requiredFields: { field1: "value1" },
        credentials: { field2: "secret" },
        status: "active",
      };

      const mockCreatedProfile: MessagingProfile = {
        id: "profile1",
        ...mockProfileData,
        requiredFields: mockProfileData.requiredFields as Prisma.JsonValue,
        credentials: expect.any(Object) as Prisma.JsonValue,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.messagingIntegration.findUnique.mockResolvedValue(
        mockIntegration
      );
      mockPrisma.messagingProfile.create.mockResolvedValue(mockCreatedProfile);

      const result = await service.createProfile(mockProfileData);

      expect(result).toEqual(
        expect.objectContaining({
          ...mockCreatedProfile,
          credentials: {},
        })
      );
      expect(mockPrisma.messagingIntegration.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(mockPrisma.messagingProfile.create).toHaveBeenCalled();
    });

    it("should throw an error if integration is not found", async () => {
      mockPrisma.messagingIntegration.findUnique.mockResolvedValue(null);

      await expect(
        service.createProfile({
          name: "Test Profile",
          integrationId: "non-existent",
          organizationId: "org1",
          requiredFields: {},
          credentials: {},
          status: "active",
        })
      ).rejects.toThrow(AppError);
    });

    it("should throw an error if required fields are missing", async () => {
      const mockIntegration: MessagingIntegration = {
        id: "1",
        name: "Test Integration",
        type: "email",
        providerName: "TestProvider",
        requiredFields: JSON.stringify(["field1", "field2"]),
        confidentialFields: JSON.stringify(["field2"]),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.messagingIntegration.findUnique.mockResolvedValue(
        mockIntegration
      );

      await expect(
        service.createProfile({
          name: "Test Profile",
          integrationId: "1",
          organizationId: "org1",
          requiredFields: {},
          credentials: {},
          status: "active",
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe("getProfiles", () => {
    it("should return all profiles for an organization", async () => {
      const mockProfiles: MessagingProfile[] = [
        {
          id: "1",
          name: "Profile 1",
          organizationId: "org1",
          integrationId: "int1",
          requiredFields: {} as Prisma.JsonValue,
          credentials: {} as Prisma.JsonValue,
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          name: "Profile 2",
          organizationId: "org1",
          integrationId: "int2",
          requiredFields: {} as Prisma.JsonValue,
          credentials: {} as Prisma.JsonValue,
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.messagingProfile.findMany.mockResolvedValue(mockProfiles);

      const result = await service.getProfiles("org1");

      expect(result).toEqual(
        mockProfiles.map((profile) => ({
          ...profile,
          credentials: {},
        }))
      );
      expect(mockPrisma.messagingProfile.findMany).toHaveBeenCalledWith({
        where: { organizationId: "org1" },
        include: { integration: true },
      });
    });
  });

  describe("getProfileById", () => {
    it("should return a profile by id", async () => {
      const mockProfile: MessagingProfile = {
        id: "1",
        name: "Profile 1",
        organizationId: "org1",
        integrationId: "int1",
        requiredFields: {} as Prisma.JsonValue,
        credentials: {} as Prisma.JsonValue,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.messagingProfile.findFirst.mockResolvedValue(mockProfile);

      const result = await service.getProfileById("1", "org1");

      expect(result).toEqual({ ...mockProfile, credentials: {} });
      expect(mockPrisma.messagingProfile.findFirst).toHaveBeenCalledWith({
        where: { id: "1", organizationId: "org1" },
        include: { integration: true },
      });
    });

    it("should return null if profile is not found", async () => {
      mockPrisma.messagingProfile.findFirst.mockResolvedValue(null);

      const result = await service.getProfileById("non-existent", "org1");

      expect(result).toBeNull();
    });
  });

  describe("updateProfile", () => {
    it("should update a profile successfully", async () => {
      const mockExistingProfile: MessagingProfile = {
        id: "1",
        name: "Old Name",
        organizationId: "org1",
        integrationId: "int1",
        requiredFields: { field1: "old value" } as Prisma.JsonValue,
        credentials: { field2: "encrypted:old secret" } as Prisma.JsonValue,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateData = {
        name: "New Name",
        requiredFields: { field1: "new value" },
        credentials: { field2: "new secret" },
      };

      const mockUpdatedProfile: MessagingProfile = {
        ...mockExistingProfile,
        name: updateData.name,
        requiredFields: updateData.requiredFields as Prisma.JsonValue,
        credentials: expect.any(Object) as Prisma.JsonValue,
      };

      mockPrisma.messagingProfile.findUnique.mockResolvedValue(
        mockExistingProfile
      );
      mockPrisma.messagingProfile.update.mockResolvedValue(mockUpdatedProfile);

      const result = await service.updateProfile("1", "org1", updateData);

      expect(result).toEqual({ ...mockUpdatedProfile, credentials: {} });
      expect(mockPrisma.messagingProfile.update).toHaveBeenCalled();
    });

    it("should throw an error if profile is not found", async () => {
      mockPrisma.messagingProfile.findUnique.mockResolvedValue(null);

      await expect(
        service.updateProfile("non-existent", "org1", { name: "New Name" })
      ).rejects.toThrow(AppError);
    });
  });

  describe("deleteProfile", () => {
    it("should delete a profile successfully", async () => {
      mockPrisma.messagingProfile.delete.mockResolvedValue(
        {} as MessagingProfile
      );

      await expect(service.deleteProfile("1", "org1")).resolves.not.toThrow();
      expect(mockPrisma.messagingProfile.delete).toHaveBeenCalledWith({
        where: { id_organizationId: { id: "1", organizationId: "org1" } },
      });
    });

    it("should throw an error if deletion fails", async () => {
      mockPrisma.messagingProfile.delete.mockRejectedValue(
        new Error("Deletion failed")
      );

      await expect(service.deleteProfile("1", "org1")).rejects.toThrow(
        AppError
      );
    });
  });
});
