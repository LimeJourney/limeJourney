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
import { EventService } from "../../services/eventsService";
import { AuthenticatedRequest, JWTAuthenticatedUser } from "../../models/auth";
import { ApiResponse } from "../../models/apiResponse";
import { EventData, RecordEventRequest } from "../../models/events";

@Route("events")
@Tags("Events")
@Security("jwt")
export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  @Post()
  @Response<ApiResponse<null>>(400, "Bad Request")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  @SuccessResponse("201", "Created")
  public async recordEvent(
    @Body() body: RecordEventRequest,
    @Request() request: AuthenticatedRequest,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
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

  @Get()
  @Response<ApiResponse<EventData[]>>(200, "Retrieved events")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getEvents(
    @Request() request: AuthenticatedRequest,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>,
    @Query() entityId?: string,
    @Query() limit?: number,
    @Query() offset?: number
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

  @Get("search")
  @Response<ApiResponse<null>>(400, "Bad Request")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async searchEvents(
    @Request() request: AuthenticatedRequest,
    @Query() searchQuery: string,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>,
    @Query() limit?: number,
    @Query() offset?: number
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

  @Get("names")
  @Response<ApiResponse<string[]>>(200, "Retrieved unique event names")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getUniqueEventNames(
    @Request() request: AuthenticatedRequest,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
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
