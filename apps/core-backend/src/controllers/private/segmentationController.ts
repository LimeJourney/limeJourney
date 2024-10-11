import * as tsoa from "tsoa";
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

@tsoa.Route("segments")
@tsoa.Tags("Segments")
@tsoa.Security("jwt")
export class SegmentController {
  private segmentationService: SegmentationService;
  private aiInsightsService: AIInsightsService;

  constructor() {
    this.segmentationService = new SegmentationService();
    this.aiInsightsService = new AIInsightsService();
  }

  @tsoa.Post()
  public async createSegment(
    @tsoa.Body() body: CreateSegmentDTO,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() badRequestResponse: tsoa.TsoaResponse<400, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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

  @tsoa.Get("{segmentId}")
  public async getSegment(
    @tsoa.Path() segmentId: string,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() badRequestResponse: tsoa.TsoaResponse<400, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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

  @tsoa.Put("{segmentId}")
  public async updateSegment(
    @tsoa.Path() segmentId: string,
    @tsoa.Body() body: UpdateSegmentDTO,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() badRequestResponse: tsoa.TsoaResponse<400, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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

  @tsoa.Delete("{segmentId}")
  public async deleteSegment(
    @tsoa.Path() segmentId: string,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() badRequestResponse: tsoa.TsoaResponse<400, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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

  @tsoa.Get()
  public async listSegments(
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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

  @tsoa.Get("{segmentId}/entities")
  public async getEntitiesInSegment(
    @tsoa.Path() segmentId: string,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() badRequestResponse: tsoa.TsoaResponse<400, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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

  @tsoa.Get("{segmentId}/analytics")
  public async getSegmentAnalytics(
    @tsoa.Path() segmentId: string,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() badRequestResponse: tsoa.TsoaResponse<400, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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

  @tsoa.Get("entity/{entityId}")
  public async getSegmentsForEntity(
    @tsoa.Path() entityId: string,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() badRequestResponse: tsoa.TsoaResponse<400, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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

  @tsoa.Post("generate")
  public async generateSegmentFromNaturalLanguage(
    @tsoa.Body() body: { input: string },
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() badRequestResponse: tsoa.TsoaResponse<400, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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
