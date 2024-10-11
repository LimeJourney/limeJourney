import { MessagingProfileService } from "../../services/messagingProfileService";
import { ApiResponse } from "../../models/apiResponse";
import { Prisma } from "@prisma/client";
import type {
  AuthenticatedRequest,
  JWTAuthenticatedUser,
} from "../../models/auth";
import { MessagingIntegrationService } from "../../services/messagingIntegrationService";
import { MessageLogService } from "../../services/messageLogService";
import {
  Body,
  Get,
  Path,
  Post,
  Query,
  Route,
  Security,
  Tags,
  Request,
  Response,
  Put,
  Delete,
  SuccessResponse,
  TsoaResponse,
  Res,
} from "tsoa";
import { MessagingIntegration } from "../../models/messagingIntegration";
import { JsonValue } from "../../models/json";

type MessagingProfile = {
  id: string;
  name: string;
  organizationId: string;
  integrationId: string;
  requiredFields: JsonValue;
  credentials: JsonValue;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type MessageLog = {
  id: string;
  messagingProfileId: string;
  event: string;
  status: string;
  metadata: JsonValue | null;
  createdAt: Date;
};

type CreateMessagingProfileInput = Omit<
  MessagingProfile,
  "id" | "createdAt" | "updatedAt" | "organizationId"
> & {
  credentials: Record<string, string>;
  requiredFields: Record<string, string>;
};

@Route("messaging-profiles")
@Tags("Messaging Profiles")
@Security("jwt")
export class MessagingProfileController {
  private profileService: MessagingProfileService;
  private integrationService: MessagingIntegrationService;
  private logService: MessageLogService;
  constructor() {
    this.profileService = new MessagingProfileService();
    this.integrationService = new MessagingIntegrationService();
    this.logService = new MessageLogService();
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

  @Get("integrations")
  @Response<ApiResponse<MessagingIntegration[]>>(200, "OK")
  public async getIntegrations(): Promise<ApiResponse<MessagingIntegration[]>> {
    console.log("getIntegrations");
    const integrations = await this.integrationService.getIntegrations();
    console.log("integrations", integrations);
    return {
      status: "success",
      data: integrations as MessagingIntegration[],
      message: "Messaging integrations retrieved successfully",
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
    console.log("getProfileById");
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

  @Get("{id}/logs")
  @Response<ApiResponse<MessageLog[]>>(200, "OK")
  public async getProfileLogs(
    @Path() id: string,
    @Query() limit: number = 100,
    @Query() offset: number = 0,
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<MessageLog[]>> {
    const user = request.user as JWTAuthenticatedUser;
    const organizationId = user.currentOrganizationId as string;
    await this.profileService.getProfileById(id, organizationId); // Ensure profile exists and user has access
    const logs = await this.logService.getLogsByProfileId(id, limit, offset);
    return {
      status: "success",
      data: logs,
      message: "Message logs retrieved successfully",
    };
  }

  @Get("{id}/analytics")
  @Response<ApiResponse<any>>(200, "OK")
  public async getProfileAnalytics(
    @Path() id: string,
    @Query() startDate: string,
    @Query() endDate: string,
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<any>> {
    const user = request.user as JWTAuthenticatedUser;
    const organizationId = user.currentOrganizationId as string;
    await this.profileService.getProfileById(id, organizationId); // Ensure profile exists and user has access
    const analytics = await this.logService.getAnalytics(
      id,
      new Date(startDate),
      new Date(endDate)
    );
    return {
      status: "success",
      data: analytics,
      message: "Analytics retrieved successfully",
    };
  }
}
