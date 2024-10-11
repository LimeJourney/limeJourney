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
} from "tsoa";
import {
  OrganizationService,
  Organization,
  OrganizationMember,
  Invitation,
} from "../../services/orgService";
import { ApiResponse } from "../../models/apiResponse";
import type { AcceptInvitationDto } from "../../models/organisation";

@Route("organizations")
@Tags("Organizations")
export class OrganizationController {
  private organizationService: OrganizationService;

  constructor() {
    this.organizationService = new OrganizationService();
  }

  @Get()
  @Security("jwt")
  @Response<ApiResponse<Organization[]>>(200, "List of user's organizations")
  public async listOrganizations(
    @Request() req: any
  ): Promise<ApiResponse<Organization[]>> {
    const userId = req.user.id;
    const organizations =
      await this.organizationService.listUserOrganizations(userId);
    return {
      status: "success",
      data: organizations,
      message: "Organizations retrieved successfully",
    };
  }

  @Put("switch/{organizationId}")
  @Security("jwt")
  @Response<ApiResponse<void>>(200, "Organization switched successfully")
  public async switchOrganization(
    @Request() req: any,
    organizationId: string
  ): Promise<ApiResponse<void>> {
    const userId = req.user.id;
    await this.organizationService.switchOrganization(userId, organizationId);
    return {
      status: "success",
      data: null,
      message: "Organization switched successfully",
    };
  }

  @Post()
  @Security("jwt")
  @Response<ApiResponse<Organization>>(201, "Organization created successfully")
  public async createOrganization(
    @Request() req: any,
    @Body() body: { name: string }
  ): Promise<ApiResponse<Organization>> {
    const userId = req.user.id;
    const organization = await this.organizationService.createOrganization(
      userId,
      body.name
    );
    return {
      status: "success",
      data: organization,
      message: "Organization created successfully",
    };
  }

  @Put("{organizationId}")
  @Security("jwt")
  @Response<ApiResponse<Organization>>(200, "Organization updated successfully")
  public async updateOrganization(
    @Request() req: any,
    organizationId: string,
    @Body() body: { name: string }
  ): Promise<ApiResponse<Organization>> {
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
  }

  @Post("{organizationId}/invite")
  @Security("jwt")
  @Response<ApiResponse<Invitation>>(201, "Invitation sent successfully")
  public async inviteUser(
    @Request() req: any,
    organizationId: string,
    @Body() body: { email: string }
  ): Promise<ApiResponse<Invitation>> {
    const userId = req.user.id;
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
  }

  @Post("accept-invitation")
  @Response<ApiResponse<OrganizationMember>>(
    200,
    "Invitation accepted successfully"
  )
  public async acceptInvitation(
    @Body() body: AcceptInvitationDto
  ): Promise<ApiResponse<OrganizationMember>> {
    const member = await this.organizationService.acceptInvitation(body);
    return {
      status: "success",
      data: member,
      message: "Invitation accepted successfully",
    };
  }
}
