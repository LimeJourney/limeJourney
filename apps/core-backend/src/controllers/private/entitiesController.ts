import * as tsoa from "tsoa";
import { EntityService, EntityData } from "../../services/entitiesService";
import type {
  AuthenticatedRequest,
  JWTAuthenticatedUser,
} from "../../models/auth";
import { ApiResponse } from "../../models/apiResponse";
import { Response as expressResponse } from "express";
import { EventData, RecordEventRequest } from "../../models/events";
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

@tsoa.Route("entities")
@tsoa.Tags("Entities")
@tsoa.Security("jwt")
export class EntityController {
  private entityService: EntityService;

  constructor() {
    this.entityService = new EntityService();
  }

  @tsoa.Get("list/entity_properties")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getEntityProperties(
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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

  @tsoa.Post()
  @tsoa.Response<ApiResponse<null>>(400, "Bad Request")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  @tsoa.SuccessResponse("201", "Created")
  public async createOrUpdateEntity(
    @tsoa.Body() body: CreateOrUpdateEntityRequest,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() badRequestResponse: tsoa.TsoaResponse<400, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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

  @tsoa.Get(":entityId")
  @tsoa.Response<ApiResponse<null>>(404, "Not Found")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getEntity(
    @tsoa.Path() entityId: string,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() notFoundResponse: tsoa.TsoaResponse<404, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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

  @tsoa.Get()
  @tsoa.Response<ApiResponse<EntityWithSegments>>(200, "Retrieved entities")
  @tsoa.Response<ApiResponse<null>>(400, "Bad request")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async listEntities(
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() notFoundResponse: tsoa.TsoaResponse<400, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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

  // @Post("event")
  // @Response<ApiResponse<null>>(400, "Bad Request")
  // @Response<ApiResponse<null>>(500, "Internal Server Error")
  // public async recordEvent(
  //   @Body() body: RecordEventRequest,
  //   @Request() request: AuthenticatedRequest,
  //   @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
  //   @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  // ): Promise<ApiResponse<EventData> | void> {
  //   try {
  //     const user = request.user as JWTAuthenticatedUser;
  //     const organizationId = user.currentOrganizationId as string;
  //     const event = await this.entityService.recordEvent(
  //       organizationId,
  //       body.entity_id,
  //       {
  //         name: body.name,
  //         properties: body.properties,
  //       }
  //     );
  //     return {
  //       status: "success",
  //       data: event,
  //       message: "Event recorded successfully",
  //     };
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       return badRequestResponse(400, {
  //         status: "error",
  //         data: null,
  //         message: error.message,
  //       });
  //     }
  //     return serverErrorResponse(500, {
  //       status: "error",
  //       data: null,
  //       message: "An error occurred while recording the event",
  //     });
  //   }
  // }

  @tsoa.Get("{entityId}/events")
  @tsoa.Response<ApiResponse<null>>(404, "Not Found")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getEntityEvents(
    @tsoa.Path() entityId: string,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() notFoundResponse: tsoa.TsoaResponse<404, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<EventData[]> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
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

  @tsoa.Get("search")
  @tsoa.Response<ApiResponse<null>>(400, "Bad Request")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async searchEntities(
    @tsoa.Query() searchQuery: string,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() badRequestResponse: tsoa.TsoaResponse<400, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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

  @tsoa.Get("stats")
  @tsoa.Response<ApiResponse<string[]>>(200, "Retrieved unique properties")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getEntityStats(
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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
