import {
  Body,
  Get,
  Path,
  Post,
  Put,
  Query,
  Route,
  Security,
  Tags,
  Request,
  Response,
  SuccessResponse,
  TsoaResponse,
  Res,
} from "tsoa";
import {
  JourneyManagementService,
  CreateJourneyDTO,
  UpdateJourneyDTO,
  JourneyMetrics,
  JourneyActivity,
} from "../../services/journeyService";
import { AuthenticatedRequest, JWTAuthenticatedUser } from "../../models/auth";
import { ApiResponse } from "../../models/apiResponse";
//   import { CreateJourneyDTO, UpdateJourneyDTO, JourneyMetrics, JourneyActivity } from "../../models/journey";

@Route("journeys")
@Tags("Journeys")
@Security("jwt")
export class JourneyManagementController {
  private journeyService: JourneyManagementService;

  constructor() {
    this.journeyService = new JourneyManagementService();
  }

  @Post()
  @Response<ApiResponse<null>>(400, "Bad Request")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  @SuccessResponse("201", "Created")
  public async createJourney(
    @Body() body: CreateJourneyDTO,
    @Request() request: AuthenticatedRequest,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
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

  @Put("{journeyId}")
  @Response<ApiResponse<null>>(400, "Bad Request")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async updateJourney(
    @Path() journeyId: string,
    @Body() body: UpdateJourneyDTO,
    @Request() request: AuthenticatedRequest,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
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

  @Get()
  @Response<ApiResponse<any[]>>(200, "Retrieved journeys")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async listJourneys(
    @Request() request: AuthenticatedRequest,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>,
    @Query() status?: string
  ): Promise<ApiResponse<any[]> | void> {
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

  @Get("{journeyId}/metrics")
  @Response<ApiResponse<JourneyMetrics>>(200, "Retrieved journey metrics")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getJourneyMetrics(
    @Path() journeyId: string,
    @Request() request: AuthenticatedRequest,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
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

  @Get("{journeyId}/activity/recent")
  @Response<ApiResponse<JourneyActivity[]>>(
    200,
    "Retrieved recent journey activity"
  )
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getRecentJourneyActivity(
    @Path() journeyId: string,
    @Request() request: AuthenticatedRequest,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>,
    @Query() limit?: number
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

  @Get("{journeyId}/activity/feed")
  @Response<ApiResponse<{ activities: JourneyActivity[]; totalCount: number }>>(
    200,
    "Retrieved journey activity feed"
  )
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getJourneyActivityFeed(
    @Path() journeyId: string,
    @Request() request: AuthenticatedRequest,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>,
    @Query() page?: number,
    @Query() pageSize?: number
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

  @Get("{journeyId}/activity/summary")
  @Response<ApiResponse<{ [key: string]: number }>>(
    200,
    "Retrieved journey activity summary"
  )
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getJourneyActivitySummary(
    @Path() journeyId: string,
    @Request() request: AuthenticatedRequest,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>,
    @Query() timeframe?: "day" | "week" | "month"
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
