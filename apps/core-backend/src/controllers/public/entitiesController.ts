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
  SuccessResponse,
  Res,
} from "tsoa";
import type { TsoaResponse } from "tsoa";
import { EntityService, EntityData } from "../../services/entitiesService";
import type {
  AuthenticatedRequest,
  JWTAuthenticatedUser,
} from "../../models/auth";
import { ApiResponse } from "../../models/apiResponse";
import { Response as expressResponse } from "express";
import { EventData, RecordEventRequest } from "../../models/events";
import { APIKeyAuthenticatedUser } from "services/jwtAuthentication";
interface CreateOrUpdateEntityRequest {
  external_id?: string;
  properties: Record<string, any>;
}

interface EntityWithSegments extends EntityData {
  segments: {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
  }[];
}

@Route("entities")
@Tags("Entities")
@Security("apiKey")
export class EntityController {
  private entityService: EntityService;

  constructor() {
    this.entityService = new EntityService();
  }

  @Post()
  @Response<ApiResponse<null>>(400, "Bad Request")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  @SuccessResponse("201", "Created")
  public async createOrUpdateEntity(
    @Body() body: CreateOrUpdateEntityRequest,
    @Request() request: AuthenticatedRequest,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<EntityData> | void> {
    try {
      const user = request.user as APIKeyAuthenticatedUser;
      const organizationId = user.organizationId as string;
      const entity = await this.entityService.createOrUpdateEntity(
        organizationId,
        body
      );
      return {
        status: "success",
        data: entity,
        message: "Entity created or updated successfully",
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
        message: "An error occurred while creating or updating the entity",
      });
    }
  }

  @Get(":entityId")
  @Response<ApiResponse<null>>(404, "Not Found")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getEntity(
    @Path() entityId: string,
    @Request() request: AuthenticatedRequest,
    @Res() notFoundResponse: TsoaResponse<404, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<EntityWithSegments> | void> {
    try {
      const user = request.user as APIKeyAuthenticatedUser;
      const organizationId = user.organizationId as string;
      const entity = await this.entityService.getEntityWithSegments(
        organizationId,
        entityId
      );
      if (!entity) {
        return notFoundResponse(404, {
          status: "error",
          data: null,
          message: "Entity not found",
        });
      }
      return {
        status: "success",
        data: entity,
        message: "Entity retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving the entity",
      });
    }
  }

  @Get()
  @Response<ApiResponse<EntityWithSegments>>(200, "Retrieved entities")
  @Response<ApiResponse<null>>(400, "Bad request")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async listEntities(
    @Request() request: AuthenticatedRequest,
    @Res() notFoundResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<EntityWithSegments[]> | void> {
    try {
      const user = request.user as APIKeyAuthenticatedUser;
      const organizationId = user.organizationId as string;
      const entities = await this.entityService.listEntities(organizationId);
      return {
        status: "success",
        data: entities,
        message: "Entities retrieved successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "BadRequestException") {
          return notFoundResponse(400, {
            status: "error",
            data: null,
            message: error.message,
          });
        } else {
          return serverErrorResponse(500, {
            status: "error",
            data: null,
            message: error.message || "An unexpected error occurred",
          });
        }
      }
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An unexpected error occurred",
      });
    }
  }

  @Get("{entityId}/events")
  @Response<ApiResponse<null>>(404, "Not Found")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getEntityEvents(
    @Path() entityId: string,
    @Request() request: AuthenticatedRequest,
    @Res() notFoundResponse: TsoaResponse<404, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<EventData[]> | void> {
    try {
      const user = request.user as APIKeyAuthenticatedUser;
      const organizationId = user.organizationId as string;
      const events = await this.entityService.getEntityEvents(
        organizationId,
        entityId
      );
      return {
        status: "success",
        data: events,
        message: "Entity events retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving entity events",
      });
    }
  }
}
