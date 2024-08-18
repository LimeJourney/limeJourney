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
  TsoaResponse,
  Res,
} from "tsoa";
import {
  EntityService,
  EntityData,
  EventData,
} from "../../services/entitiesService";
import { AuthenticatedRequest, JWTAuthenticatedUser } from "../../models/auth";
import { ApiResponse } from "../../models/apiResponse";
import { Response as expressResponse } from "express";
interface CreateOrUpdateEntityRequest {
  external_id?: string;
  properties: Record<string, any>;
}

interface RecordEventRequest {
  entityId: string;
  name: string;
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
@Security("jwt")
export class EntityController {
  private entityService: EntityService;

  constructor() {
    this.entityService = new EntityService();
  }

  @Get("list/entity_properties")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getEntityProperties(
    @Request() request: AuthenticatedRequest,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<string[]> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const properties =
        await this.entityService.listUniqueProperties(organizationId);

      return {
        status: "success",
        data: properties,
        message: "Entity properties retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving entity properties",
      });
    }
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
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
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
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
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
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
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

  @Post("event")
  @Response<ApiResponse<null>>(400, "Bad Request")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async recordEvent(
    @Body() body: RecordEventRequest,
    @Request() request: AuthenticatedRequest,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<EventData> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const event = await this.entityService.recordEvent(
        organizationId,
        body.entityId,
        {
          name: body.name,
          properties: body.properties,
        }
      );
      return {
        status: "success",
        data: event,
        message: "Event recorded successfully",
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
        message: "An error occurred while recording the event",
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
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const events = await this.entityService.getEntityEvents(
        organizationId,
        entityId
      );
      if (!events.length) {
        return notFoundResponse(404, {
          status: "error",
          data: null,
          message: "No events found for this entity",
        });
      }
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

  @Get("search")
  @Response<ApiResponse<null>>(400, "Bad Request")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async searchEntities(
    @Query() searchQuery: string,
    @Request() request: AuthenticatedRequest,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<EntityData[]> | void> {
    try {
      if (!searchQuery) {
        return badRequestResponse(400, {
          status: "error",
          data: null,
          message: "Search query is required",
        });
      }
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const entities = await this.entityService.searchEntities(
        organizationId,
        searchQuery
      );
      return {
        status: "success",
        data: entities,
        message: "Entities searched successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while searching entities",
      });
    }
  }

  @Get("stats")
  @Response<ApiResponse<string[]>>(200, "Retrieved unique properties")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getEntityStats(
    @Request() request: AuthenticatedRequest,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<{
    totalEntities: number;
    oldestEntity: string;
    newestEntity: string;
    uniqueExternalIds: number;
  }> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const stats = await this.entityService.getEntityStats(organizationId);
      return {
        status: "success",
        data: stats,
        message: "Entity statistics retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving entity statistics",
      });
    }
  }
}
