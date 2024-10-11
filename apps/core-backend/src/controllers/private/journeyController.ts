import * as tsoa from "tsoa";
import {
  JourneyManagementService,
  CreateJourneyDTO,
  UpdateJourneyDTO,
  JourneyMetrics,
  JourneyActivity,
  JourneyWithMetrics,
} from "../../services/journeyService";
import type {
  AuthenticatedRequest,
  JWTAuthenticatedUser,
} from "../../models/auth";
import { ApiResponse } from "../../models/apiResponse";
import { logger } from "@lime/telemetry/logger";
//   import { CreateJourneyDTO, UpdateJourneyDTO, JourneyMetrics, JourneyActivity } from "../../models/journey";

@tsoa.Route("journeys")
@tsoa.Tags("Journeys")
@tsoa.Security("jwt")
export class JourneyManagementController {
  private journeyService: JourneyManagementService;

  constructor() {
    this.journeyService = new JourneyManagementService();
  }

  @tsoa.Post()
  @tsoa.Response<ApiResponse<null>>(400, "Bad Request")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  @tsoa.SuccessResponse("201", "Created")
  public async createJourney(
    @tsoa.Body() body: Omit<CreateJourneyDTO, "organizationId">,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() badRequestResponse: tsoa.TsoaResponse<400, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<any> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const journey = await this.journeyService.createJourney({
        ...body,
        organizationId,
      });
      return {
        status: "success",
        data: journey,
        message: "Journey created successfully",
      };
    } catch (error) {
      logger.error("lifecycle", "Error creating journey", error as Error);
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
        message: "An error occurred while creating the journey",
      });
    }
  }

  @tsoa.Put("{journeyId}")
  @tsoa.Response<ApiResponse<null>>(400, "Bad Request")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async updateJourney(
    @tsoa.Path() journeyId: string,
    @tsoa.Body() body: Omit<UpdateJourneyDTO, "organizationId" | "id">,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() badRequestResponse: tsoa.TsoaResponse<400, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<any> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const updatedJourney = await this.journeyService.updateJourney({
        id: journeyId,
        organizationId: organizationId,
        name: body.name,
        status: body.status,
        // ...body,
      });
      return {
        status: "success",
        data: updatedJourney,
        message: "Journey updated successfully",
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
        message: "An error occurred while updating the journey",
      });
    }
  }

  @tsoa.Get()
  @tsoa.Response<ApiResponse<JourneyWithMetrics[]>>(200, "Retrieved journeys")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async listJourneys(
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>,
    @tsoa.Query() status?: string
  ): Promise<ApiResponse<JourneyWithMetrics[]> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const journeys = await this.journeyService.listJourneys(
        organizationId,
        status
      );
      return {
        status: "success",
        data: journeys,
        message: "Journeys retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving journeys",
      });
    }
  }

  @tsoa.Get("{journeyId}/metrics")
  @tsoa.Response<ApiResponse<JourneyMetrics>>(200, "Retrieved journey metrics")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getJourneyMetrics(
    @tsoa.Path() journeyId: string,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<JourneyMetrics> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const metrics = await this.journeyService.getJourneyMetrics(journeyId);
      return {
        status: "success",
        data: metrics,
        message: "Journey metrics retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving journey metrics",
      });
    }
  }

  @tsoa.Get("{journeyId}/activity/recent")
  @tsoa.Response<ApiResponse<JourneyActivity[]>>(
    200,
    "Retrieved recent journey activity"
  )
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getRecentJourneyActivity(
    @tsoa.Path() journeyId: string,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>,
    @tsoa.Query() limit?: number
  ): Promise<ApiResponse<JourneyActivity[]> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const activities = await this.journeyService.getRecentJourneyActivity(
        journeyId,
        limit
      );
      return {
        status: "success",
        data: activities,
        message: "Recent journey activity retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving recent journey activity",
      });
    }
  }

  @tsoa.Get("{journeyId}/activity/feed")
  @tsoa.Response<
    ApiResponse<{ activities: JourneyActivity[]; totalCount: number }>
  >(200, "Retrieved journey activity feed")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getJourneyActivityFeed(
    @tsoa.Path() journeyId: string,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>,
    @tsoa.Query() page?: number,
    @tsoa.Query() pageSize?: number
  ): Promise<ApiResponse<{
    activities: JourneyActivity[];
    totalCount: number;
  }> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const activityFeed = await this.journeyService.getJourneyActivityFeed(
        journeyId,
        page,
        pageSize,
        organizationId
      );
      return {
        status: "success",
        data: activityFeed,
        message: "Journey activity feed retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving journey activity feed",
      });
    }
  }

  @tsoa.Get("{journeyId}/activity/summary")
  @tsoa.Response<ApiResponse<{ [key: string]: number }>>(
    200,
    "Retrieved journey activity summary"
  )
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getJourneyActivitySummary(
    @tsoa.Path() journeyId: string,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>,
    @tsoa.Query() timeframe?: "day" | "week" | "month"
  ): Promise<ApiResponse<{ [key: string]: number }> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const summary = await this.journeyService.getJourneyActivitySummary(
        journeyId,
        timeframe,
        organizationId
      );
      return {
        status: "success",
        data: summary,
        message: "Journey activity summary retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving journey activity summary",
      });
    }
  }
}
