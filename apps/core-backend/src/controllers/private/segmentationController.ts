import {
  Body,
  Get,
  Path,
  Post,
  Put,
  Delete,
  Route,
  Security,
  Tags,
  Request,
  Res,
} from "tsoa";
import type { TsoaResponse } from "tsoa";
import type {
  Segment,
  CreateSegmentDTO,
  UpdateSegmentDTO,
  SegmentAnalytics,
  SegmentCondition,
} from "../../models/segmentation";
import type {
  AuthenticatedRequest,
  JWTAuthenticatedUser,
} from "../../models/auth";
import { ApiResponse } from "../../models/apiResponse";
import { SegmentationService } from "../../services/segmentationService";
import { AIInsightsService } from "../../services/insightService";

@Route("segments")
@Tags("Segments")
@Security("jwt")
export class SegmentController {
  private segmentationService: SegmentationService;
  private aiInsightsService: AIInsightsService;

  constructor() {
    this.segmentationService = new SegmentationService();
    this.aiInsightsService = new AIInsightsService();
  }

  @Post()
  public async createSegment(
    @Body() body: CreateSegmentDTO,
    @Request() request: AuthenticatedRequest,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<Segment>> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const segment = await this.segmentationService.createSegment(
        organizationId,
        body
      );
      return {
        status: "success",
        data: segment,
        message: "Segment created successfully",
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
        message: "An error occurred while creating the segment",
      });
    }
  }

  @Get("{segmentId}")
  public async getSegment(
    @Path() segmentId: string,
    @Request() request: AuthenticatedRequest,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<Segment>> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const segment = await this.segmentationService.getSegment(
        segmentId,
        organizationId
      );
      if (!segment) {
        return badRequestResponse(400, {
          status: "error",
          data: null,
          message: "Segment not found",
        });
      }
      return {
        status: "success",
        data: segment,
        message: "Segment retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving the segment",
      });
    }
  }

  @Put("{segmentId}")
  public async updateSegment(
    @Path() segmentId: string,
    @Body() body: UpdateSegmentDTO,
    @Request() request: AuthenticatedRequest,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<Segment>> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const segment = await this.segmentationService.updateSegment(
        segmentId,
        organizationId,
        body
      );
      if (!segment) {
        return badRequestResponse(400, {
          status: "error",
          data: null,
          message: "Segment not found",
        });
      }
      return {
        status: "success",
        data: segment,
        message: "Segment updated successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while updating the segment",
      });
    }
  }

  @Delete("{segmentId}")
  public async deleteSegment(
    @Path() segmentId: string,
    @Request() request: AuthenticatedRequest,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<boolean>> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const result = await this.segmentationService.deleteSegment(
        segmentId,
        organizationId
      );
      return {
        status: "success",
        data: result,
        message: result
          ? "Segment deleted successfully"
          : "Segment not found or already deleted",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while deleting the segment",
      });
    }
  }

  @Get()
  public async listSegments(
    @Request() request: AuthenticatedRequest,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<Segment[]>> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const segments =
        await this.segmentationService.listSegments(organizationId);
      return {
        status: "success",
        data: segments,
        message: "Segments retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving segments",
      });
    }
  }

  @Get("{segmentId}/entities")
  public async getEntitiesInSegment(
    @Path() segmentId: string,
    @Request() request: AuthenticatedRequest,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<string[]>> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const entities = await this.segmentationService.getEntitiesInSegment(
        segmentId,
        organizationId
      );
      return {
        status: "success",
        data: entities,
        message: "Entities in segment retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving entities in the segment",
      });
    }
  }

  @Get("{segmentId}/analytics")
  public async getSegmentAnalytics(
    @Path() segmentId: string,
    @Request() request: AuthenticatedRequest,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<SegmentAnalytics>> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const analytics = await this.segmentationService.getSegmentAnalytics(
        segmentId,
        organizationId
      );
      return {
        status: "success",
        data: analytics,
        message: "Segment analytics retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving segment analytics",
      });
    }
  }

  @Get("entity/{entityId}")
  public async getSegmentsForEntity(
    @Path() entityId: string,
    @Request() request: AuthenticatedRequest,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<Segment[]>> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const segments = await this.segmentationService.getSegmentsForEntity(
        entityId,
        organizationId
      );
      return {
        status: "success",
        data: segments,
        message: "Segments for entity retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving segments for the entity",
      });
    }
  }

  @Post("generate")
  public async generateSegmentFromNaturalLanguage(
    @Body() body: { input: string },
    @Request() request: AuthenticatedRequest,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<{ conditions: SegmentCondition[] }>> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;

      const generatedSegment =
        await this.aiInsightsService.generateSegmentFromNaturalLanguage(
          organizationId,
          body.input
        );

      return {
        status: "success",
        data: generatedSegment,
        message: "Segment conditions generated successfully",
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
        message: "An error occurred while generating segment conditions",
      });
    }
  }
}
