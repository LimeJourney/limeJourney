import {
  Body,
  Post,
  Route,
  Tags,
  Response,
  Get,
  Request,
  SuccessResponse,
} from "tsoa";
import { AuthService } from "../../services/authService";
import { SignupRequest, LoginRequest, AuthData } from "../../models/auth";
import { ApiResponse } from "../../models/apiResponse";

@Route("auth")
@Tags("Authentication")
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  @Post("/signup")
  @Response<ApiResponse<AuthData>>(201, "User created")
  @Response<ApiResponse<null>>(400, "Bad request")
  public async signup(
    @Body() body: SignupRequest
  ): Promise<ApiResponse<AuthData>> {
    try {
      const authData = await this.authService.signup(body);
      return {
        status: "success",
        data: authData,
        message: "User created successfully",
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }

  @Post("/login")
  @Response<ApiResponse<AuthData>>(200, "Login successful")
  @Response<ApiResponse<null>>(401, "Unauthorized")
  public async login(
    @Body() body: LoginRequest
  ): Promise<ApiResponse<AuthData>> {
    try {
      const authData = await this.authService.login(body);
      return {
        status: "success",
        data: authData,
        message: "Login successful",
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
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
}
