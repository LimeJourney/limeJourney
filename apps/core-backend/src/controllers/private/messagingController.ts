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
  Response,
} from "tsoa";
import { MessagingIntegrationService } from "../services/messagingIntegrationService";
import { ApiResponse } from "../models/apiResponse";
import { MessagingIntegration } from "@prisma/client";

@Route("admin/messaging-integrations")
@Tags("Admin Messaging")
@Security("jwt")
export class AdminMessagingController {
  private integrationService: MessagingIntegrationService;

  constructor() {
    this.integrationService = new MessagingIntegrationService();
  }

  @Post()
  @Response<ApiResponse<MessagingIntegration>>(201, "Created")
  public async createIntegration(
    @Body() body: Omit<MessagingIntegration, "id" | "createdAt" | "updatedAt">
  ): Promise<ApiResponse<MessagingIntegration>> {
    const integration = await this.integrationService.createIntegration(body);
    return {
      status: "success",
      data: integration,
      message: "Messaging integration created successfully",
    };
  }

  @Get()
  @Response<ApiResponse<MessagingIntegration[]>>(200, "OK")
  public async getIntegrations(): Promise<ApiResponse<MessagingIntegration[]>> {
    const integrations = await this.integrationService.getIntegrations();
    return {
      status: "success",
      data: integrations,
      message: "Messaging integrations retrieved successfully",
    };
  }

  @Put("{id}")
  @Response<ApiResponse<MessagingIntegration>>(200, "OK")
  public async updateIntegration(
    @Path() id: string,
    @Body() body: Partial<MessagingIntegration>
  ): Promise<ApiResponse<MessagingIntegration>> {
    const integration = await this.integrationService.updateIntegration(
      id,
      body
    );
    return {
      status: "success",
      data: integration,
      message: "Messaging integration updated successfully",
    };
  }

  @Delete("{id}")
  @Response<ApiResponse<null>>(204, "No Content")
  public async deleteIntegration(
    @Path() id: string
  ): Promise<ApiResponse<null>> {
    await this.integrationService.deleteIntegration(id);
    return {
      status: "success",
      data: null,
      message: "Messaging integration deleted successfully",
    };
  }
}
