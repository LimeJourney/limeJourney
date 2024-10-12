import { apiCall } from "./baseService";

export interface Organization {
  id: string;
  name: string;
  subscriptionId?: string | null;
  subscriptionStatus: SubscriptionStatus;
  planId?: string | null;
  subscriptionPeriodStart?: Date | null;
  subscriptionPeriodEnd?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invitation {
  id: string;
  email: string;
  organizationId: string;
  invitedBy: string;
  status: InvitationStatus;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvitationDetails {
  organizationName: string;
  email: string;
}

export interface AcceptInvitationDto {
  invitationId: string;
  email: string;
  name?: string;
  password?: string;
}

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

// Organization Service
export const OrganizationService = {
  async listUserOrganizations(): Promise<Organization[]> {
    return apiCall<Organization[]>("get", "/organizations");
  },

  async switchOrganization(organizationId: string): Promise<void> {
    return apiCall<void>("put", `/organizations/switch/${organizationId}`);
  },

  async createOrganization(name: string): Promise<Organization> {
    return apiCall<Organization>("post", "/organizations", { name });
  },

  async updateOrganization(
    organizationId: string,
    name: string
  ): Promise<Organization> {
    return apiCall<Organization>("put", `/organizations/${organizationId}`, {
      name,
    });
  },

  async inviteUser(organizationId: string, email: string): Promise<Invitation> {
    return apiCall<Invitation>(
      "post",
      `/organizations/${organizationId}/invite`,
      { email }
    );
  },

  async getInvitationDetails(invitationId: string): Promise<InvitationDetails> {
    return apiCall<InvitationDetails>(
      "get",
      `/organizations/invitations/${invitationId}`
    );
  },

  async acceptInvitation(
    data: AcceptInvitationDto
  ): Promise<OrganizationMember> {
    return apiCall<OrganizationMember>(
      "post",
      "/organizations/accept-invitation",
      data
    );
  },

  async getOrganizationMembers(
    organizationId: string
  ): Promise<OrganizationMember[]> {
    return apiCall<OrganizationMember[]>(
      "get",
      `/organizations/${organizationId}/members`
    );
  },

  async removeOrganizationMember(
    organizationId: string,
    userId: string
  ): Promise<void> {
    return apiCall<void>(
      "delete",
      `/organizations/${organizationId}/members/${userId}`
    );
  },

  async updateMemberRole(
    organizationId: string,
    userId: string,
    role: UserRole
  ): Promise<OrganizationMember> {
    return apiCall<OrganizationMember>(
      "put",
      `/organizations/${organizationId}/members/${userId}`,
      { role }
    );
  },

  async getOrganizationInvitations(
    organizationId: string
  ): Promise<Invitation[]> {
    return apiCall<Invitation[]>(
      "get",
      `/organizations/${organizationId}/invitations`
    );
  },

  async cancelInvitation(invitationId: string): Promise<void> {
    return apiCall<void>(
      "delete",
      `/organizations/invitations/${invitationId}`
    );
  },

  async resendInvitation(invitationId: string): Promise<Invitation> {
    return apiCall<Invitation>(
      "post",
      `/organizations/invitations/${invitationId}/resend`
    );
  },

  async getOrganizationDetails(organizationId: string): Promise<Organization> {
    return apiCall<Organization>("get", `/organizations/${organizationId}`);
  },

  async deleteOrganization(organizationId: string): Promise<void> {
    return apiCall<void>("delete", `/organizations/${organizationId}`);
  },

  async updateOrganizationSubscription(
    organizationId: string,
    planId: string
  ): Promise<Organization> {
    return apiCall<Organization>(
      "put",
      `/organizations/${organizationId}/subscription`,
      { planId }
    );
  },

  async getCurrentOrganization(): Promise<Organization | null> {
    try {
      return await apiCall<Organization>("get", "/organizations/current");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },
};
