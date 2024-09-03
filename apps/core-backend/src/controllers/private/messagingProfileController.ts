import {
  Body,
  Get,
  Post,
  Put,
  Delete,
  Route,
  Security,
  Tags,
  Path,
  Request,
  Response,
} from "tsoa";
import { MessagingProfileService } from "../../services/messagingProfileService";
import { ApiResponse } from "../../models/apiResponse";
import { MessagingProfile, Prisma } from "@prisma/client";
import { AuthenticatedRequest, JWTAuthenticatedUser } from "../../models/auth";

type CreateMessagingProfileInput = Omit<
  MessagingProfile,
  "id" | "createdAt" | "updatedAt" | "organizationId"
> & {
  credentials: Record<string, string>;
};

@Route("messaging-profiles")
@Tags("Messaging Profiles")
@Security("jwt")
export class MessagingProfileController {
  private profileService: MessagingProfileService;

  constructor() {
    this.profileService = new MessagingProfileService();
  }

  @Post()
  @Response<ApiResponse<MessagingProfile>>(201, "Created")
  public async createProfile(
    @Body() body: CreateMessagingProfileInput,
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<MessagingProfile>> {
    const user = request.user as JWTAuthenticatedUser;
    const organizationId = user.currentOrganizationId as string;
    const profile = await this.profileService.createProfile({
      ...body,
      organizationId,
    });
    return {
      status: "success",
      data: profile,
      message: "Messaging profile created successfully",
    };
  }

  @Get()
  @Response<ApiResponse<MessagingProfile[]>>(200, "OK")
  public async getProfiles(
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<MessagingProfile[]>> {
    const user = request.user as JWTAuthenticatedUser;
    const organizationId = user.currentOrganizationId as string;
    const profiles = await this.profileService.getProfiles(organizationId);
    return {
      status: "success",
      data: profiles,
      message: "Messaging profiles retrieved successfully",
    };
  }

  @Get("{id}")
  @Response<ApiResponse<MessagingProfile>>(200, "OK")
  public async getProfileById(
    @Path() id: string,
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<MessagingProfile>> {
    const user = request.user as JWTAuthenticatedUser;
    const organizationId = user.currentOrganizationId as string;
    const profile = await this.profileService.getProfileById(
      id,
      organizationId
    );
    return {
      status: "success",
      data: profile!,
      message: "Messaging profile retrieved successfully",
    };
  }

  @Put("{id}")
  @Response<ApiResponse<MessagingProfile>>(200, "OK")
  public async updateProfile(
    @Path() id: string,
    @Body() body: Partial<CreateMessagingProfileInput>,
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<MessagingProfile>> {
    const user = request.user as JWTAuthenticatedUser;
    const organizationId = user.currentOrganizationId as string;
    const profile = await this.profileService.updateProfile(
      id,
      organizationId,
      body
    );
    return {
      status: "success",
      data: profile,
      message: "Messaging profile updated successfully",
    };
  }

  @Delete("{id}")
  @Response<ApiResponse<null>>(204, "No Content")
  public async deleteProfile(
    @Path() id: string,
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<null>> {
    const user = request.user as JWTAuthenticatedUser;
    const organizationId = user.currentOrganizationId as string;
    await this.profileService.deleteProfile(id, organizationId);
    return {
      status: "success",
      data: null,
      message: "Messaging profile deleted successfully",
    };
  }
}
