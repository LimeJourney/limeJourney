import {
  Body,
  Delete,
  Get,
  Path,
  Post,
  Route,
  Security,
  Tags,
  Request,
} from "tsoa";
import { ApiKey, ApiKeyService } from "../../services/apiKeyService";
import { AuthenticatedRequest, JWTAuthenticatedUser } from "../../models/auth";
import { ApiResponse } from "../../models/apiResponse";

interface GenerateApiKeyRequest {
  name: string;
}

@Route("api-keys")
@Tags("API Keys")
@Security("jwt")
export class ApiKeyController {
  private apiKeyService: ApiKeyService;

  constructor() {
    this.apiKeyService = new ApiKeyService();
  }

  @Post()
  public async generateApiKey(
    @Body() body: GenerateApiKeyRequest,
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<ApiKey>> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const apiKey = await this.apiKeyService.generateApiKey(
        organizationId,
        body.name
      );
      return {
        status: "success",
        data: apiKey,
        message: "API key generated successfully",
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while generating the API key",
      };
    }
  }

  @Get()
  public async getApiKeys(
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<ApiKey[]>> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const apiKeys = await this.apiKeyService.getApiKeys(organizationId);
      return {
        status: "success",
        data: apiKeys,
        message: "API keys retrieved successfully",
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while retrieving API keys",
      };
    }
  }

  @Delete("{id}")
  public async deleteApiKey(
    @Path() id: string,
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<null>> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      await this.apiKeyService.deleteApiKey(id, organizationId);
      return {
        status: "success",
        data: null,
        message: "API key deleted successfully",
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while deleting the API key",
      };
    }
  }
}
