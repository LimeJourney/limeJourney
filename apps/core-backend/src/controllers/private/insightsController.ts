import {
  Body,
  Get,
  Post,
  Route,
  Security,
  Tags,
  Request,
  Response,
  SuccessResponse,
  Res,
} from "tsoa";
import type { TsoaResponse } from "tsoa";
import {
  AIInsightsService,
  InsightResponse,
  OrganizationInsights,
} from "../../services/insightService";
import type {
  AuthenticatedRequest,
  JWTAuthenticatedUser,
} from "../../models/auth";
import { ApiResponse } from "../../models/apiResponse";

interface InsightQuery {
  query: string;
}

@Route("insights")
@Tags("AI Insights")
@Security("jwt")
export class AIInsightsController {
  private aiInsightsService: AIInsightsService;

  constructor() {
    this.aiInsightsService = new AIInsightsService();
  }

  @Post("query")
  @Response<ApiResponse<null>>(400, "Bad Request")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  @SuccessResponse("200", "Success")
  public async getInsights(
    @Body() body: InsightQuery,
    @Request() request: AuthenticatedRequest,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<InsightResponse> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const insightResponse = await this.aiInsightsService.getInsights({
        organizationId,
        query: body.query,
      });
      return {
        status: "success",
        data: insightResponse,
        message: "Insights generated successfully",
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
        message: "An error occurred while generating insights",
      });
    }
  }

  @Get("queries")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getRecentQueries(
    @Request() request: AuthenticatedRequest,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<OrganizationInsights["recentQueries"]> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const recentQueries =
        await this.aiInsightsService.getRecentQueries(organizationId);
      return {
        status: "success",
        data: recentQueries,
        message: "Recent queries retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving recent queries",
      });
    }
  }

  @Get("")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getOrganizationInsights(
    @Request() request: AuthenticatedRequest,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<OrganizationInsights> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const organizationInsights =
        await this.aiInsightsService.getOrganizationInsights(organizationId);
      return {
        status: "success",
        data: organizationInsights,
        message: "Organization insights retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving organization insights",
      });
    }
  }
}
