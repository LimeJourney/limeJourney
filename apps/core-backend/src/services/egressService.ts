import {
  PrismaClient,
  MessagingProfile,
  Template,
  Prisma,
} from "@prisma/client";
import { AppError } from "@lime/errors";
import { logger } from "@lime/telemetry/logger";
import { MessagingProfileService } from "./messagingProfileService";
import { TemplateService } from "./templateService";
import { EntityData } from "./entitiesService";

interface EmailData {
  label: "email";
  subject: string;
  templateId: string;
  templateName: string;
}

export class EgressService {
  private messagingProfileService: MessagingProfileService;
  private templateService: TemplateService;
  private prisma: PrismaClient;

  constructor() {
    this.messagingProfileService = new MessagingProfileService();
    this.templateService = new TemplateService();
    this.prisma = new PrismaClient();
  }

  async handleJourneyEmail(
    emailData: EmailData,
    entityData: EntityData
  ): Promise<void> {
    console.log("Handling journey email", { emailData, entityData });
    try {
      // Find email in properties
      // const parsedProperties = this.parseProperties(entityData.properties);
      const email = this.findEmailInProperties(entityData.properties);
      if (!email) {
        throw new AppError(
          "No valid email found for entity",
          400,
          "NO_VALID_EMAIL"
        );
      }

      // Retrieve the template
      const template = await this.templateService.getTemplate(
        emailData.templateId
      );
      if (!template) {
        throw new AppError("Template not found", 404, "TEMPLATE_NOT_FOUND");
      }

      // Find the messaging profile
      if (!template.messagingProfileId) {
        throw new AppError(
          "Template has no associated messaging profile",
          400,
          "NO_MESSAGING_PROFILE"
        );
      }
      const profile = await this.messagingProfileService.getProfileById(
        template.messagingProfileId,
        template.organizationId
      );
      if (!profile) {
        throw new AppError(
          "Messaging profile not found",
          404,
          "PROFILE_NOT_FOUND"
        );
      }

      // Populate HTML content
      const populatedContent = this.populateHTMLTemplate(
        template.content,
        entityData
      );
      const populatedSubject = emailData.subject;

      // Send email based on the profile
      await this.sendEmail(profile, {
        to: email, // Assuming 'email' is part of EntityData
        subject: populatedSubject,
        html: populatedContent,
      });

      logger.info(
        "lifecycle",
        `Email sent successfully for template: ${emailData.templateName}`
      );
    } catch (error: any) {
      logger.error("lifecycle", `Error handling journey email`, error);

      if (error instanceof AppError) {
        // Rethrow AppErrors as they are
        throw error;
      } else {
        // Wrap unexpected errors as 500 internal server errors
        throw new AppError(
          "Unexpected error while handling journey email",
          500,
          "INTERNAL_SERVER_ERROR"
        );
      }
    }
  }

  private async sendEmail(
    profile: MessagingProfile,
    emailOptions: { to: string; subject: string; html: string }
  ): Promise<void> {
    console.log("Sending email", { profile, emailOptions });
    // Implement sending logic based on the profile type
    // switch (profile.name) {
    //   case "RESEND":
    //     await this.sendWithResend(profile, emailOptions);
    //     break;
    //   case "AWS_SES":
    //     await this.sendWithAWSSES(profile, emailOptions);
    //     break;
    //   // Add more cases for other email service providers
    //   default:
    //     throw new AppError(
    //       `Unsupported email service: ${profile.name}`,
    //       400,
    //       "UNSUPPORTED_EMAIL_SERVICE"
    //     );
    // }
  }

  private async sendWithResend(
    profile: MessagingProfile,
    emailOptions: { to: string; subject: string; html: string }
  ): Promise<void> {
    // Implement Resend-specific sending logic
    // You would typically use Resend's SDK or API here
    console.log("Sending with Resend", { profile, emailOptions });
  }

  private async sendWithAWSSES(
    profile: MessagingProfile,
    emailOptions: { to: string; subject: string; html: string }
  ): Promise<void> {
    // Implement AWS SES-specific sending logic
    // You would typically use AWS SDK here
    console.log("Sending with AWS SES", { profile, emailOptions });
  }

  private findEmailInProperties(
    properties: Record<string, any>
  ): string | null {
    console.log("Finding email in properties", { properties });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const [key, value] of Object.entries(properties)) {
      if (typeof value === "string" && emailRegex.test(value)) {
        return value;
      }
    }
    return null;
  }

  private parseProperties(propertiesString: string): Record<string, any> {
    try {
      return JSON.parse(propertiesString);
    } catch (error) {
      throw new AppError(
        "Failed to parse properties string",
        400,
        "INVALID_PROPERTIES_FORMAT"
      );
    }
  }

  private populateHTMLTemplate(
    template: string,
    entityData: EntityData
  ): string {
    const { properties } = entityData;

    logger.debug("temporal", "template", { template });
    // Find all placeholders in the template
    const placeholders = template.match(/{{(\w+)}}/g) || [];

    // Create a map of placeholders to their corresponding values
    const placeholderMap: Record<string, string> = {};

    placeholders.forEach((placeholder) => {
      const key = placeholder.replace(/{{|}}/g, "");
      if (key in properties) {
        placeholderMap[placeholder] = String(properties[key]);
      } else {
        // If the placeholder doesn't match any property, leave it unchanged
        placeholderMap[placeholder] = placeholder;
      }
    });

    // Replace placeholders in the template
    let populatedTemplate = template;
    for (const [placeholder, value] of Object.entries(placeholderMap)) {
      populatedTemplate = populatedTemplate.replace(
        new RegExp(placeholder, "g"),
        value
      );
    }

    return populatedTemplate;
  }
}
