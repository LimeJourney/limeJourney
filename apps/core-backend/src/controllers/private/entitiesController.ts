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
} from "tsoa";
import {
  EntityService,
  EntityData,
  EventData,
} from "../../services/entitiesService";
import { AuthenticatedRequest, JWTAuthenticatedUser } from "../../models/auth";
import { ApiResponse } from "../../models/apiResponse";

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

  @Post()
  public async createOrUpdateEntity(
    @Body() body: CreateOrUpdateEntityRequest,
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<EntityData>> {
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
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while creating or updating the entity",
      };
    }
  }

  @Get("{entityId}")
  public async getEntity(
    @Path() entityId: string,
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<EntityWithSegments>> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const entity = await this.entityService.getEntityWithSegments(
        organizationId,
        entityId
      );
      return {
        status: "success",
        data: entity,
        message: "Entity retrieved successfully",
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while retrieving the entity",
      };
    }
  }

  @Get()
  public async listEntities(
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<EntityWithSegments[]>> {
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
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while retrieving entities",
      };
    }
  }

  @Post("event")
  public async recordEvent(
    @Body() body: RecordEventRequest,
    @Request() request: AuthenticatedRequest
  ): Promise<
    ApiResponse<EventData & { entity_id: string; timestamp: string }>
  > {
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
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while recording the event",
      };
    }
  }

  @Get("{entityId}/events")
  public async getEntityEvents(
    @Path() entityId: string,
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<EventData[]>> {
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
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while retrieving entity events",
      };
    }
  }

  @Get("search")
  public async searchEntities(
    @Query() searchQuery: string,
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<EntityData[]>> {
    try {
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
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while searching entities",
      };
    }
  }

  @Get("stats")
  public async getEntityStats(
    @Request() request: AuthenticatedRequest
  ): Promise<
    ApiResponse<{
      totalEntities: number;
      oldestEntity: string;
      newestEntity: string;
      uniqueExternalIds: number;
    }>
  > {
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
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while retrieving entity statistics",
      };
    }
  }
}
