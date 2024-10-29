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
import { EventService } from "../../services/eventsService";
import type {
  APIKeyAuthenticatedUser,
  AuthenticatedRequest,
} from "../../models/auth";
import { ApiResponse } from "../../models/apiResponse";
import type { EventData, RecordEventRequest } from "../../models/events";

@Route("events")
@Tags("Events")
@Security("apiKey")
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
      const user = request.user as APIKeyAuthenticatedUser;
      const organizationId = user.organizationId;
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
      const user = request.user as APIKeyAuthenticatedUser;
      const organizationId = user.organizationId as string;
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

  @Get("names")
  @Response<ApiResponse<string[]>>(200, "Retrieved unique event names")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getUniqueEventNames(
    @Request() request: AuthenticatedRequest,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<string[]> | void> {
    try {
      const user = request.user as APIKeyAuthenticatedUser;
      const organizationId = user.organizationId as string;
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
}
