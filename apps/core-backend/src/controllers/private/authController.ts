import {
  Body,
  Post,
  Route,
  Tags,
  Response,
  Get,
  Request,
  SuccessResponse,
  Res,
  Security,
} from "tsoa";
import type { TsoaResponse } from "tsoa";
import { AuthService } from "../../services/authenticationService";
import { ApiResponse } from "../../models/apiResponse";
import type {
  AuthData,
  AuthenticatedRequest,
  AuthRequest,
  JWTAuthenticatedUser,
} from "../../models/auth";

@Route("auth")
@Tags("Authentication")
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  @Post("/authenticate")
  @Response<ApiResponse<AuthData>>(200, "Authentication successful")
  @Response<ApiResponse<null>>(400, "Bad request")
  @Response<ApiResponse<null>>(500, "Internal server error")
  public async authenticate(
    @Body() body: AuthRequest,
    @Res() notFoundResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<AuthData> | void> {
    try {
      const authData = await this.authService.authenticate(body);
      return {
        status: "success",
        data: authData,
        message: "Authentication successful",
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

  @Get("/google")
  @SuccessResponse("302", "Redirect to Google")
  @Response("400", "Bad Request")
  public googleAuth(@Request() req: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const res = {
        redirect: (url: string) => {
          resolve();
        },
      };
      this.authService.getGoogleAuthMiddleware()(req, res, (err: any) => {
        if (err) {
          reject(err);
        }
      });
    });
  }

  @Get("/google/callback")
  @SuccessResponse("302", "Redirect after Google authentication")
  @Response("400", "Bad Request")
  public async googleAuthCallback(@Request() req: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const res = {
        redirect: (url: string) => {
          resolve();
        },
      };
      try {
        const data = await this.authService.handleGoogleCallback(req, res);

        res.redirect(`/login/success?token=${data.token}`);
      } catch (error) {
        res.redirect("/login?error=Google authentication failed");
      }
    });
  }

  @Get("/current-user")
  @Security("jwt")
  @Response<ApiResponse<null>>(401, "Unauthorized")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getCurrentUser(
    @Request() request: AuthenticatedRequest,
    @Res() unauthorizedResponse: TsoaResponse<401, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<JWTAuthenticatedUser> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      if (!user) {
        return unauthorizedResponse(401, {
          status: "error",
          data: null,
          message: "User not authenticated",
        });
      }

      return {
        status: "success",
        data: user,
        message: "Current user retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving the current user",
      });
    }
  }
}
