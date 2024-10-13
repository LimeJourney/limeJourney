import {
  Body,
  Post,
  Route,
  Security,
  Request,
  Response,
  SuccessResponse,
  Res,
  Tags,
  Get,
} from "tsoa";
import type { TsoaResponse } from "tsoa";
import { BillingService } from "../../services/billingService";
import type {
  AuthenticatedRequest,
  JWTAuthenticatedUser,
} from "../../models/auth";
import { ApiResponse } from "../../models/apiResponse";
import { AppConfig } from "@lime/config";

@Route("billing")
@Tags("Billing")
export class BillingController {
  private billingService: BillingService;

  constructor() {
    this.billingService = new BillingService();
  }

  @Post("create-checkout-session")
  @Security("jwt")
  @Response<ApiResponse<null>>(400, "Bad Request")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  @SuccessResponse("200", "Created")
  public async createCheckoutSession(
    @Request() request: AuthenticatedRequest,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<{ url: string }> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const url =
        await this.billingService.createCheckoutSession(organizationId);
      return {
        status: "success",
        data: { url },
        message: "Checkout session created successfully",
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
        message: "An error occurred while creating the checkout session",
      });
    }
  }

  @Post("create-portal-session")
  @Security("jwt")
  @Response<ApiResponse<null>>(400, "Bad Request")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  @SuccessResponse("200", "Created")
  public async createPortalSession(
    @Request() request: AuthenticatedRequest,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<{ url: string }> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const url = await this.billingService.createPortalSession(organizationId);
      return {
        status: "success",
        data: { url },
        message: "Portal session created successfully",
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
        message: "An error occurred while creating the portal session",
      });
    }
  }

  @Post("webhook")
  @Response<ApiResponse<null>>(400, "Bad Request")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async handleWebhook(
    @Request() request: any,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<{ received: boolean }> | void> {
    try {
      const signature = request.headers["stripe-signature"] as string;

      if (!signature) {
        return badRequestResponse(400, {
          status: "error",
          data: null,
          message: "No Stripe signature found in the request headers",
        });
      }

      if (!request.rawBody) {
        return badRequestResponse(400, {
          status: "error",
          data: null,
          message: "Raw body is missing",
        });
      }

      const result = await this.billingService.handleWebhook(
        signature,
        request.rawBody
      );

      return {
        status: "success",
        data: result,
        message: "Webhook handled successfully",
      };
    } catch (error) {
      console.error("Error processing webhook:", error);
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
        message: "An error occurred while handling the webhook",
      });
    }
  }

  @Get("subscription-enforcement")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  @SuccessResponse("200", "OK")
  public async getSubscriptionEnforcement(
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<{ enforced: boolean }> | void> {
    try {
      const enforceSubscriptions = AppConfig.enforceSubscriptions;
      return {
        status: "success",
        data: { enforced: enforceSubscriptions },
        message: "Subscription enforcement status retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message:
          "An error occurred while retrieving subscription enforcement status",
      });
    }
  }
}
