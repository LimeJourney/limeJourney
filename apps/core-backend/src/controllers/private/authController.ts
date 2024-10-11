import * as tsoa from "tsoa";
import { AuthService } from "../../services/authenticationService";
import type { ApiResponse } from "../../models/apiResponse";
import type { AuthData, AuthRequest } from "../../models/auth";

@tsoa.Route("auth")
@tsoa.Tags("Authentication")
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  @tsoa.Post("/authenticate")
  @tsoa.Response<ApiResponse<AuthData>>(200, "Authentication successful")
  @tsoa.Response<ApiResponse<null>>(400, "Bad request")
  @tsoa.Response<ApiResponse<null>>(500, "Internal server error")
  public async authenticate(
    @tsoa.Body() body: AuthRequest,
    @tsoa.Res() notFoundResponse: tsoa.TsoaResponse<400, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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

  @tsoa.Get("/google")
  @tsoa.SuccessResponse("302", "Redirect to Google")
  @tsoa.Response("400", "Bad Request")
  public googleAuth(@tsoa.Request() req: any): Promise<void> {
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

  @tsoa.Get("/google/callback")
  @tsoa.SuccessResponse("302", "Redirect after Google authentication")
  @tsoa.Response("400", "Bad Request")
  public async googleAuthCallback(@tsoa.Request() req: any): Promise<void> {
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
}
