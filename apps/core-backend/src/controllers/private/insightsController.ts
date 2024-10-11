import * as tsoa from "tsoa";
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

@tsoa.Route("insights")
@tsoa.Tags("AI Insights")
@tsoa.Security("jwt")
export class AIInsightsController {
  private aiInsightsService: AIInsightsService;

  constructor() {
    this.aiInsightsService = new AIInsightsService();
  }

  @tsoa.Post("query")
  @tsoa.Response<ApiResponse<null>>(400, "Bad Request")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  @tsoa.SuccessResponse("200", "Success")
  public async getInsights(
    @tsoa.Body() body: InsightQuery,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() badRequestResponse: tsoa.TsoaResponse<400, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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

  @tsoa.Get("queries")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getRecentQueries(
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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

  @tsoa.Get("")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getOrganizationInsights(
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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
