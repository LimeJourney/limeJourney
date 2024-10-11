import * as tsoa from "tsoa";
import {
  TemplateService,
  Template,
  ChannelType,
  TemplateStatus,
} from "../../services/templateService";
import type {
  AuthenticatedRequest,
  JWTAuthenticatedUser,
} from "../../models/auth";
import { ApiResponse } from "../../models/apiResponse";
interface CreateTemplateRequest {
  name: string;
  channel: ChannelType;
  subjectLine: string;
  previewText: string;
  content: string;
  tags: string[];
  status: TemplateStatus;
  messagingProfileId: string;
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

// Utility type to convert enum to Prisma's filter type
type EnumFilter<T> = {
  equals?: T;
  in?: T[];
  notIn?: T[];
  not?: T;
};
@tsoa.Route("templates")
@tsoa.Tags("Templates")
@tsoa.Security("jwt")
export class TemplateController {
  private templateService: TemplateService;

  constructor() {
    this.templateService = new TemplateService();
  }

  @tsoa.Post()
  @tsoa.Response<ApiResponse<null>>(400, "Bad Request")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  @tsoa.SuccessResponse("201", "Created")
  public async createTemplate(
    @tsoa.Body() body: CreateTemplateRequest,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() badRequestResponse: tsoa.TsoaResponse<400, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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

  @tsoa.Get("{templateId}")
  @tsoa.Response<ApiResponse<null>>(404, "Not Found")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getTemplate(
    @tsoa.Path() templateId: string,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() notFoundResponse: tsoa.TsoaResponse<404, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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

  @tsoa.Put("{templateId}")
  @tsoa.Response<ApiResponse<null>>(400, "Bad Request")
  @tsoa.Response<ApiResponse<null>>(404, "Not Found")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async updateTemplate(
    @tsoa.Path() templateId: string,
    @tsoa.Body() body: UpdateTemplateRequest,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() badRequestResponse: tsoa.TsoaResponse<400, ApiResponse<null>>,
    @tsoa.Res() notFoundResponse: tsoa.TsoaResponse<404, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
  ): Promise<ApiResponse<Template> | void> {
    try {
      const updatedTemplate = await this.templateService.updateTemplate(
        templateId,
        {
          ...body,
        }
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

  @tsoa.Get()
  @tsoa.Response<ApiResponse<Template[]>>(200, "Retrieved templates")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async getTemplates(
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>,
    @tsoa.Query() limit?: number,
    @tsoa.Query() offset?: number,
    @tsoa.Query() channel?: ChannelType,
    @tsoa.Query() status?: TemplateStatus,
    @tsoa.Query() search?: string
  ): Promise<ApiResponse<Template[]> | void> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const templates = await this.templateService.getTemplates(
        organizationId,
        limit,
        offset,
        {
          channel,
          status,
          search,
        }
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

  @tsoa.Delete("{templateId}")
  @tsoa.Response<ApiResponse<null>>(404, "Not Found")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async deleteTemplate(
    @tsoa.Path() templateId: string,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() notFoundResponse: tsoa.TsoaResponse<404, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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

  @tsoa.Post("{templateId}/duplicate")
  @tsoa.Response<ApiResponse<null>>(404, "Not Found")
  @tsoa.Response<ApiResponse<null>>(500, "Internal Server Error")
  public async duplicateTemplate(
    @tsoa.Path() templateId: string,
    @tsoa.Request() request: AuthenticatedRequest,
    @tsoa.Res() notFoundResponse: tsoa.TsoaResponse<404, ApiResponse<null>>,
    @tsoa.Res() serverErrorResponse: tsoa.TsoaResponse<500, ApiResponse<null>>
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
