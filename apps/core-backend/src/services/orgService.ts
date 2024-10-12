import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { AcceptInvitationDto } from "../models/organisation";

// Define types identical to Prisma client types
export type User = {
  id: string;
  email: string;
  password?: string | null;
  name?: string | null;
  googleId?: string | null;
  isEmailVerified: boolean;
  lastLoginAt?: Date | null;
  profilePictureUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: UserRole;
  currentOrganizationId?: string | null;
};

export type Organization = {
  id: string;
  name: string;
  subscriptionId?: string | null;
  subscriptionStatus: SubscriptionStatus;
  planId?: string | null;
  subscriptionPeriodStart?: Date | null;
  subscriptionPeriodEnd?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type OrganizationMember = {
  id: string;
  userId: string;
  organizationId: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export type Invitation = {
  id: string;
  email: string;
  organizationId: string;
  invitedBy: string;
  status: InvitationStatus;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PAST_DUE = "PAST_DUE",
  CANCELLED = "CANCELLED",
}
export class OrganizationService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async listUserOrganizations(userId: string): Promise<Organization[]> {
    const memberships = await this.prisma.organizationMember.findMany({
      where: { userId },
      include: { organization: true },
    });
    return memberships.map((membership) => ({
      ...membership.organization,
      subscriptionStatus: membership.organization
        .subscriptionStatus as SubscriptionStatus,
    }));
  }

  async switchOrganization(
    userId: string,
    organizationId: string
  ): Promise<User> {
    const membership = await this.prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
    });

    if (!membership) {
      throw new Error("User is not a member of this organization");
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { currentOrganizationId: organizationId },
    });

    const resp: User = {
      ...updatedUser,
      role: updatedUser.role as UserRole,
    };

    return resp;
  }

  async createOrganization(
    userId: string,
    name: string
  ): Promise<Organization> {
    const organization = await this.prisma.organization.create({
      data: { name },
    });

    await this.prisma.organizationMember.create({
      data: {
        userId,
        organizationId: organization.id,
        role: "ADMIN",
      },
    });

    return {
      ...organization,
      subscriptionStatus: organization.subscriptionStatus as SubscriptionStatus,
    };
  }

  async updateOrganization(
    organizationId: string,
    name: string
  ): Promise<Organization> {
    const updatedOrg = await this.prisma.organization.update({
      where: { id: organizationId },
      data: { name },
    });
    return {
      ...updatedOrg,
      subscriptionStatus: updatedOrg.subscriptionStatus as SubscriptionStatus,
    };
  }

  async inviteUser(
    inviterId: string,
    organizationId: string,
    email: string
  ): Promise<Invitation> {
    const inviter = await this.prisma.user.findUnique({
      where: { id: inviterId },
    });
    if (!inviter || inviter.currentOrganizationId !== organizationId) {
      throw new Error("Inviter is not a member of this organization");
    }

    const invitation = await this.prisma.invitation.create({
      data: {
        email,
        organizationId,
        invitedBy: inviterId,
        status: "PENDING",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    });

    const invitationLink = `http://yourdomain.com/invitation/${invitation.id}`;
    // TODO: Send email with invitationLink

    return {
      ...invitation,
      status: invitation.status as InvitationStatus,
    };
  }

  async acceptInvitation(
    data: AcceptInvitationDto
  ): Promise<OrganizationMember> {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id: data.invitationId },
      include: { organization: true },
    });

    if (
      !invitation ||
      invitation.status !== "PENDING" ||
      invitation.expiresAt < new Date()
    ) {
      throw new Error("Invalid or expired invitation");
    }

    if (invitation.email !== data.email) {
      throw new Error("Email does not match the invitation");
    }

    // Use a transaction to ensure atomicity
    const member = await this.prisma.$transaction(async (prisma) => {
      let user = await prisma.user.findUnique({ where: { email: data.email } });

      if (!user) {
        // Create a new user if they don't exist
        const hashedPassword = await bcrypt.hash(data.password, 10);
        user = await prisma.user.create({
          data: {
            email: data.email,
            name: data.name,
            password: hashedPassword,
            currentOrganizationId: invitation.organizationId,
          },
        });
      } else {
        // Check if the user is already a member of the organization
        const existingMembership = await prisma.organizationMember.findUnique({
          where: {
            userId_organizationId: {
              userId: user.id,
              organizationId: invitation.organizationId,
            },
          },
        });

        if (existingMembership) {
          throw new Error("User is already a member of this organization");
        }
      }

      // Create the organization membership
      const member = await prisma.organizationMember.create({
        data: {
          userId: user.id,
          organizationId: invitation.organizationId,
          role: "MEMBER",
        },
      });

      // Update the invitation status
      await prisma.invitation.update({
        where: { id: data.invitationId },
        data: { status: "ACCEPTED" },
      });

      // If the user didn't have a current organization, set this one as current
      if (!user.currentOrganizationId) {
        await prisma.user.update({
          where: { id: user.id },
          data: { currentOrganizationId: invitation.organizationId },
        });
      }

      return member;
    });

    return {
      ...member,
      role: member.role as UserRole,
    };
  }

  async getInvitationDetails(
    invitationId: string
  ): Promise<{ organizationName: string; email: string }> {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id: invitationId },
      include: { organization: true },
    });

    if (
      !invitation ||
      invitation.status !== "PENDING" ||
      invitation.expiresAt < new Date()
    ) {
      throw new Error("Invalid or expired invitation");
    }

    return {
      organizationName: invitation.organization.name,
      email: invitation.email,
    };
  }

  async getCurrentOrganization(userId: string): Promise<Organization | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { currentOrganization: true },
    });

    if (!user || !user.currentOrganization) {
      return null;
    }

    return {
      ...user.currentOrganization,
      subscriptionStatus: user.currentOrganization
        .subscriptionStatus as SubscriptionStatus,
    };
  }

  async getOrganizationInvitations(
    organizationId: string
  ): Promise<Invitation[]> {
    const invitations = await this.prisma.invitation.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });

    return invitations.map((invitation) => ({
      ...invitation,
      status: invitation.status as InvitationStatus,
    }));
  }

  async getOrganizationMembers(
    organizationId: string
  ): Promise<OrganizationMember[]> {
    const members = await this.prisma.organizationMember.findMany({
      where: { organizationId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });

    return members.map((member) => ({
      id: member.id,
      userId: member.userId,
      organizationId: member.organizationId,
      role: member.role as UserRole,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
      user: {
        id: member.user.id,
        email: member.user.email,
        name: member.user.name,
      },
    }));
  }
}
