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
import {
  IntegrationFields,
  MessagingIntegrationService,
} from "../../services/messagingIntegrationService";
import { ApiResponse } from "../../models/apiResponse";
import { MessagingIntegration } from "../../models/messagingIntegration";
// Define interfaces for create and update inputs
interface CreateMessagingIntegrationInput {
  name: string;
  type: string;
  providerName: string;
  requiredFields: string[];
  confidentialFields: string[];
}

interface UpdateMessagingIntegrationInput {
  name?: string;
  type?: string;
  providerName?: string;
  requiredFields?: string[];
}

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
    @Body() body: CreateMessagingIntegrationInput
  ): Promise<ApiResponse<MessagingIntegration>> {
    const integration = await this.integrationService.createIntegration({
      ...body,
      requiredFields: body.requiredFields,
      confidentialFields: body.confidentialFields,
    });
    return {
      status: "success",
      data: integration as MessagingIntegration,
      message: "Messaging integration created successfully",
    };
  }

  @Get()
  @Response<ApiResponse<MessagingIntegration[]>>(200, "OK")
  public async getIntegrations(): Promise<ApiResponse<MessagingIntegration[]>> {
    const integrations = await this.integrationService.getIntegrations();
    return {
      status: "success",
      data: integrations as MessagingIntegration[],
      message: "Messaging integrations retrieved successfully",
    };
  }

  @Put("{id}")
  @Response<ApiResponse<MessagingIntegration>>(200, "OK")
  public async updateIntegration(
    @Path() id: string,
    @Body() body: UpdateMessagingIntegrationInput
  ): Promise<ApiResponse<MessagingIntegration>> {
    const updateData: Partial<
      Omit<
        CreateMessagingIntegrationInput,
        "requiredFields" | "confidentialFields"
      > &
        Partial<IntegrationFields>
    > = {
      ...body,
      requiredFields: body.requiredFields,
    };
    const integration = await this.integrationService.updateIntegration(
      id,
      updateData
    );
    return {
      status: "success",
      data: integration as MessagingIntegration,
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
