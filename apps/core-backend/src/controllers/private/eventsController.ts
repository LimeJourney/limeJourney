import * as tsoa from "tsoa";
import { EventService } from "../../services/eventsService";
import type {
  AuthenticatedRequest,
  JWTAuthenticatedUser,
} from "../../models/auth";
import { ApiResponse } from "../../models/apiResponse";
import type { EventData, RecordEventRequest } from "../../models/events";

@tsoa.Route("events")
@tsoa.Tags("Events")
@tsoa.Security("jwt")
export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  @tsoa.Post()
  @tsoa.Response<ApiResponse<null>>(400, "Bad Request")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  @tsoa.SuccessResponse("201", "Created")
  public async recordEvent(
    @tsoa.Body() body: RecordEventRequest,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() badRequestResponse: tsoa.TsoaResponse<400, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<EventData> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const event = await this.eventService.recordEvent(organizationId, body);
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

  @tsoa.Get()
  @tsoa.Response<ApiResponse<EventData[]>>(200, "Retrieved events")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getEvents(
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>,
    @tsoa.Query() entityId?: string,
    @tsoa.Query() limit?: number,
    @tsoa.Query() offset?: number
  ): Promise<ApiResponse<EventData[]> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const events = await this.eventService.getEvents(
        organizationId,
        entityId,
        limit,
        offset
      );
      return {
        status: "success",
        data: events,
        message: "Events retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving events",
      });
    }
  }

  @tsoa.Get("search")
  @tsoa.Response<ApiResponse<null>>(400, "Bad Request")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async searchEvents(
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Query() searchQuery: string,
    @tsoa.Res() badRequestResponse: tsoa.TsoaResponse<400, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>,
    @tsoa.Query() limit?: number,
    @tsoa.Query() offset?: number
  ): Promise<ApiResponse<EventData[]> | void> {
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
      const events = await this.eventService.searchEvents(
        organizationId,
        searchQuery,
        limit,
        offset
      );
      return {
        status: "success",
        data: events,
        message: "Events searched successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while searching events",
      });
    }
  }

  @tsoa.Get("names")
  @tsoa.Response<ApiResponse<string[]>>(200, "Retrieved unique event names")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getUniqueEventNames(
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<string[]> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const uniqueEventNames =
        await this.eventService.getUniqueEventNames(organizationId);
      return {
        status: "success",
        data: uniqueEventNames,
        message: "Unique event names retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving unique event names",
      });
    }
  }

  //   @Get("entity/:entityId")
  //   @Response<ApiResponse<EventData[]>>(200, "Retrieved events for entity")
  //   @Response<ApiResponse<null>>(500, "Internal Server Error")
  //   public async getEventsByEntityId(
  //     @Request() request: AuthenticatedRequest,
  //     @Path() entityId: string,
  //     @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>,
  //     @Query() limit?: number,
  //     @Query() offset?: number
  //   ): Promise<ApiResponse<EventData[]> | void> {
  //     try {
  //       const user = request.user as JWTAuthenticatedUser;
  //       const organizationId = user.currentOrganizationId as string;
  //       const events = await this.eventService.getEventsByEntityId(
  //         organizationId,
  //         entityId,
  //         limit,
  //         offset
  //       );
  //       return {
  //         status: "success",
  //         data: events,
  //         message: "Events for entity retrieved successfully",
  //       };
  //     } catch (error) {
  //       return serverErrorResponse(500, {
  //         status: "error",
  //         data: null,
  //         message: "An error occurred while retrieving events for the entity",
  //       });
  //     }
  //   }
}
