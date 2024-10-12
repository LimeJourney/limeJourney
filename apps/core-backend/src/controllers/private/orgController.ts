import {
  Body,
  Get,
  Post,
  Put,
  Route,
  Tags,
  Response,
  Security,
  Request,
  Res,
} from "tsoa";
import type { TsoaResponse } from "tsoa";
import {
  OrganizationService,
  Organization,
  OrganizationMember,
  Invitation,
} from "../../services/orgService";
import { ApiResponse } from "../../models/apiResponse";
import type { AcceptInvitationDto } from "../../models/organisation";
import type {
  AuthenticatedRequest,
  JWTAuthenticatedUser,
} from "../../models/auth";

@Route("organizations")
@Tags("Organizations")
@Security("jwt")
export class OrganizationController {
  private organizationService: OrganizationService;

  constructor() {
    this.organizationService = new OrganizationService();
  }

  @Get()
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async listOrganizations(
    @Request() req: AuthenticatedRequest,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<Organization[]> | void> {
    try {
      const user = req.user as JWTAuthenticatedUser;
      const userId = user.id;
      const organizations =
        await this.organizationService.listUserOrganizations(userId);
      return {
        status: "success",
        data: organizations,
        message: "Organizations retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving organizations",
      });
    }
  }

  @Put("switch/{organizationId}")
  @Response<ApiResponse<null>>(400, "Bad Request")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async switchOrganization(
    @Request() req: AuthenticatedRequest,
    organizationId: string,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<void> | void> {
    try {
      const user = req.user as JWTAuthenticatedUser;
      const userId = user.id;
      await this.organizationService.switchOrganization(userId, organizationId);
      return {
        status: "success",
        data: null,
        message: "Organization switched successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return badRequestResponse(400, {
          status: "error",
          data: null,
          message: error.message,
        });
      }
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while switching organization",
      });
    }
  }

  @Post()
  @Response<ApiResponse<null>>(400, "Bad Request")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async createOrganization(
    @Request() req: AuthenticatedRequest,
    @Body() body: { name: string },
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<Organization> | void> {
    try {
      const user = req.user as JWTAuthenticatedUser;
      const userId = user.id;
      const organization = await this.organizationService.createOrganization(
        userId,
        body.name
      );
      return {
        status: "success",
        data: organization,
        message: "Organization created successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return badRequestResponse(400, {
          status: "error",
          data: null,
          message: error.message,
        });
      }
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while creating the organization",
      });
    }
  }

  @Put("{organizationId}")
  @Response<ApiResponse<null>>(400, "Bad Request")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async updateOrganization(
    @Request() req: AuthenticatedRequest,
    organizationId: string,
    @Body() body: { name: string },
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<Organization> | void> {
    try {
      // TODO: Add authorization check to ensure user is admin of the organization
      const organization = await this.organizationService.updateOrganization(
        organizationId,
        body.name
      );
      return {
        status: "success",
        data: organization,
        message: "Organization updated successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return badRequestResponse(400, {
          status: "error",
          data: null,
          message: error.message,
        });
      }
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while updating the organization",
      });
    }
  }

  @Post("{organizationId}/invite")
  @Response<ApiResponse<null>>(400, "Bad Request")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async inviteUser(
    @Request() req: AuthenticatedRequest,
    organizationId: string,
    @Body() body: { email: string },
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<Invitation> | void> {
    try {
      const user = req.user as JWTAuthenticatedUser;
      const userId = user.id;
      const invitation = await this.organizationService.inviteUser(
        userId,
        organizationId,
        body.email
      );
      return {
        status: "success",
        data: invitation,
        message: "Invitation sent successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return badRequestResponse(400, {
          status: "error",
          data: null,
          message: error.message,
        });
      }
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while sending the invitation",
      });
    }
  }

  @Post("invite/accept")
  @Response<ApiResponse<null>>(400, "Bad Request")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async acceptInvitation(
    @Request() req: AuthenticatedRequest,
    @Body() body: AcceptInvitationDto,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<OrganizationMember> | void> {
    try {
      const member = await this.organizationService.acceptInvitation(body);
      return {
        status: "success",
        data: member,
        message: "Invitation accepted successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return badRequestResponse(400, {
          status: "error",
          data: null,
          message: error.message,
        });
      }
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while accepting the invitation",
      });
    }
  }

  @Get("invitations/{invitationId}")
  @Response<ApiResponse<null>>(400, "Bad Request")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getInvitationDetails(
    invitationId: string,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<{ organizationName: string; email: string }> | void> {
    try {
      const invitationDetails =
        await this.organizationService.getInvitationDetails(invitationId);
      return {
        status: "success",
        data: invitationDetails,
        message: "Invitation details retrieved successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return badRequestResponse(400, {
          status: "error",
          data: null,
          message: error.message,
        });
      }
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving invitation details",
      });
    }
  }

  @Get("current")
  @Response<ApiResponse<null>>(404, "Not Found")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getCurrentOrganization(
    @Request() req: AuthenticatedRequest,
    @Res() notFoundResponse: TsoaResponse<404, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<Organization> | void> {
    try {
      const user = req.user as JWTAuthenticatedUser;
      const organization =
        await this.organizationService.getCurrentOrganization(user.id);

      if (!organization) {
        return notFoundResponse(404, {
          status: "error",
          data: null,
          message: "Current organization not found",
        });
      }

      return {
        status: "success",
        data: organization,
        message: "Current organization retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving the current organization",
      });
    }
  }

  @Get("{organizationId}/invitations")
  @Response<ApiResponse<null>>(400, "Bad Request")
  @Response<ApiResponse<null>>(403, "Forbidden")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getOrganizationInvitations(
    @Request() req: AuthenticatedRequest,
    organizationId: string,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() forbiddenResponse: TsoaResponse<403, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<Invitation[]> | void> {
    try {
      const user = req.user as JWTAuthenticatedUser;

      // Check if user is a member of the organization
      // const isMember = await this.organizationService.isUserMemberOfOrganization(user.id, organizationId);
      // if (!isMember) {
      //   return forbiddenResponse(403, {
      //     status: "error",
      //     data: null,
      //     message: "User is not a member of this organization",
      //   });
      // }

      const invitations =
        await this.organizationService.getOrganizationInvitations(
          organizationId
        );

      return {
        status: "success",
        data: invitations,
        message: "Organization invitations retrieved successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return badRequestResponse(400, {
          status: "error",
          data: null,
          message: error.message,
        });
      }
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving organization invitations",
      });
    }
  }

  @Get("{organizationId}/members")
  @Response<ApiResponse<null>>(400, "Bad Request")
  @Response<ApiResponse<null>>(403, "Forbidden")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getOrganizationMembers(
    @Request() req: AuthenticatedRequest,
    organizationId: string,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() forbiddenResponse: TsoaResponse<403, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<OrganizationMember[]> | void> {
    try {
      const user = req.user as JWTAuthenticatedUser;

      // Check if user is a member of the organization
      // const isMember = await this.organizationService.isUserMemberOfOrganization(user.id, organizationId);
      // if (!isMember) {
      //   return forbiddenResponse(403, {
      //     status: "error",
      //     data: null,
      //     message: "User is not a member of this organization",
      //   });
      // }

      const members =
        await this.organizationService.getOrganizationMembers(organizationId);

      return {
        status: "success",
        data: members,
        message: "Organization members retrieved successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return badRequestResponse(400, {
          status: "error",
          data: null,
          message: error.message,
        });
      }
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving organization members",
      });
    }
  }
}
