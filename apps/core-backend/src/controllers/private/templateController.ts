import {
  Body,
  Get,
  Path,
  Post,
  Put,
  Delete,
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
import { TemplateService } from "../../services/templateService";
import { AuthenticatedRequest, JWTAuthenticatedUser } from "../../models/auth";
import { ApiResponse } from "../../models/apiResponse";
import { Template, ChannelType, Prisma, TemplateStatus } from "@prisma/client";

interface CreateTemplateRequest {
  name: string;
  channel: ChannelType;
  subjectLine: string | null; // Remove the optional (?) modifier
  previewText: string | null;
  content: string;
  tags: string[];
  status: TemplateStatus;
  messagingProfileId: string | null;
}

interface UpdateTemplateRequest {
  name?: string;
  channel?: ChannelType;
  subjectLine?: string | null;
  previewText?: string | null;
  content?: string;
  tags?: string[];
  status?: TemplateStatus;
  messagingProfileId?: string | null;
}

@Route("templates")
@Tags("Templates")
@Security("jwt")
export class TemplateController {
  private templateService: TemplateService;

  constructor() {
    this.templateService = new TemplateService();
  }

  @Post()
  @Response<ApiResponse<null>>(400, "Bad Request")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  @SuccessResponse("201", "Created")
  public async createTemplate(
    @Body() body: CreateTemplateRequest,
    @Request() request: AuthenticatedRequest,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<Template> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const template = await this.templateService.createTemplate({
        ...body,
        organizationId,
      });
      return {
        status: "success",
        data: template,
        message: "Template created successfully",
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
        message: "An error occurred while creating the template",
      });
    }
  }

  @Get("{templateId}")
  @Response<ApiResponse<null>>(404, "Not Found")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getTemplate(
    @Path() templateId: string,
    @Request() request: AuthenticatedRequest,
    @Res() notFoundResponse: TsoaResponse<404, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<Template> | void> {
    try {
      const template = await this.templateService.getTemplate(templateId);
      if (!template) {
        return notFoundResponse(404, {
          status: "error",
          data: null,
          message: "Template not found",
        });
      }
      return {
        status: "success",
        data: template,
        message: "Template retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving the template",
      });
    }
  }

  @Put("{templateId}")
  @Response<ApiResponse<null>>(400, "Bad Request")
  @Response<ApiResponse<null>>(404, "Not Found")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async updateTemplate(
    @Path() templateId: string,
    @Body() body: UpdateTemplateRequest,
    @Request() request: AuthenticatedRequest,
    @Res() badRequestResponse: TsoaResponse<400, ApiResponse<null>>,
    @Res() notFoundResponse: TsoaResponse<404, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<Template> | void> {
    try {
      const updatedTemplate = await this.templateService.updateTemplate(
        templateId,
        body
      );
      return {
        status: "success",
        data: updatedTemplate,
        message: "Template updated successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("not found")) {
          return notFoundResponse(404, {
            status: "error",
            data: null,
            message: "Template not found",
          });
        }
        return badRequestResponse(400, {
          status: "error",
          data: null,
          message: error.message,
        });
      }
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while updating the template",
      });
    }
  }

  @Delete("{templateId}")
  @Response<ApiResponse<null>>(404, "Not Found")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async deleteTemplate(
    @Path() templateId: string,
    @Request() request: AuthenticatedRequest,
    @Res() notFoundResponse: TsoaResponse<404, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<null> | void> {
    try {
      await this.templateService.deleteTemplate(templateId);
      return {
        status: "success",
        data: null,
        message: "Template deleted successfully",
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return notFoundResponse(404, {
          status: "error",
          data: null,
          message: "Template not found",
        });
      }
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while deleting the template",
      });
    }
  }

  @Get()
  @Response<ApiResponse<Template[]>>(200, "Retrieved templates")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getTemplates(
    @Request() request: AuthenticatedRequest,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>,
    @Query() limit?: number,
    @Query() offset?: number,
    @Query() channel?: ChannelType,
    @Query() status?: Prisma.EnumTemplateStatusFilter,
    @Query() search?: string
  ): Promise<ApiResponse<Template[]> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const templates = await this.templateService.getTemplates(
        organizationId,
        limit,
        offset,
        { channel, status, search }
      );
      return {
        status: "success",
        data: templates,
        message: "Templates retrieved successfully",
      };
    } catch (error) {
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while retrieving templates",
      });
    }
  }

  @Post("{templateId}/duplicate")
  @Response<ApiResponse<null>>(404, "Not Found")
  @Response<ApiResponse<null>>(500, "Internal Server Error")
  public async duplicateTemplate(
    @Path() templateId: string,
    @Request() request: AuthenticatedRequest,
    @Res() notFoundResponse: TsoaResponse<404, ApiResponse<null>>,
    @Res() serverErrorResponse: TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<Template> | void> {
    try {
      const duplicatedTemplate =
        await this.templateService.duplicateTemplate(templateId);
      return {
        status: "success",
        data: duplicatedTemplate,
        message: "Template duplicated successfully",
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return notFoundResponse(404, {
          status: "error",
          data: null,
          message: "Template not found",
        });
      }
      return serverErrorResponse(500, {
        status: "error",
        data: null,
        message: "An error occurred while duplicating the template",
      });
    }
  }
}
