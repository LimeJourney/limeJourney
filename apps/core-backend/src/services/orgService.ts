import {
  PrismaClient,
  User,
  Organization,
  OrganizationMember,
  Invitation,
} from "@prisma/client";
import bcrypt from "bcrypt";
import { AcceptInvitationDto } from "../models/organisation";

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
    return memberships.map((membership) => membership.organization);
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

    return this.prisma.user.update({
      where: { id: userId },
      data: { currentOrganizationId: organizationId },
    });
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

    return organization;
  }

  async updateOrganization(
    organizationId: string,
    name: string
  ): Promise<Organization> {
    return this.prisma.organization.update({
      where: { id: organizationId },
      data: { name },
    });
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

    return invitation;
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
    return this.prisma.$transaction(async (prisma) => {
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
  }
}
