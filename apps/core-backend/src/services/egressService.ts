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
import { Resend } from "resend";
import fetch, { Headers, Response, Request } from "node-fetch";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

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
      const profile =
        await this.messagingProfileService.getProfileWithCredentials(
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
        to: email,
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
    profile: MessagingProfile & { integration?: { name: string } },
    emailOptions: { to: string; subject: string; html: string }
  ): Promise<void> {
    const integrationName = profile.integration.name;
    // Implement sending logic based on the profile type
    switch (integrationName) {
      case "RESEND":
        await this.sendWithResend(profile, emailOptions);
        break;
      case "AWS_SES":
        await this.sendWithAWSSES(profile, emailOptions);
        break;
      // Add more cases for other email service providers
      default:
        throw new AppError(
          `Unsupported email service: ${profile.name}`,
          400,
          "UNSUPPORTED_EMAIL_SERVICE"
        );
    }
  }

  private async sendWithResend(
    profile: MessagingProfile,
    emailOptions: { to: string; subject: string; html: string }
  ): Promise<void> {
    if (!global.fetch) {
      global.fetch = fetch as unknown as typeof global.fetch;
      global.Headers = Headers as unknown as typeof global.Headers;
      global.Response = Response as unknown as typeof global.Response;
      global.Request = Request as unknown as typeof global.Request;
    }

    try {
      // Extract the API key from the profile credentials
      const credentials = profile.credentials as Record<string, any>;
      if (!credentials.apiKey) {
        throw new AppError(
          "Resend API key not found in profile credentials",
          400,
          "MISSING_API_KEY"
        );
      }

      // Initialize Resend client
      const resend = new Resend(credentials.apiKey);

      // Get the sender email from required fields
      const requiredFields = profile.requiredFields as Record<string, any>;
      if (!requiredFields.fromEmail) {
        throw new AppError(
          "Sender email not found in profile required fields",
          400,
          "MISSING_FROM_EMAIL"
        );
      }

      // Send email using Resend
      const response = await resend.emails.send({
        from: requiredFields.fromEmail,
        to: emailOptions.to,
        replyTo: requiredFields.replyToEmail || requiredFields.fromEmail,
        subject: emailOptions.subject,
        html: emailOptions.html,
      });

      if (!response.data.id) {
        throw new AppError(
          "Failed to send email through Resend",
          500,
          "RESEND_SEND_ERROR"
        );
      }

      logger.info(
        "email",
        `Email sent successfully via Resend. ID: ${response.data.id}`
      );
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        `Failed to send email via Resend: ${error.message}`,
        500,
        "RESEND_ERROR"
      );
    }
  }

  private async sendWithAWSSES(
    profile: MessagingProfile,
    emailOptions: { to: string; subject: string; html: string }
  ): Promise<void> {
    try {
      // Extract AWS credentials from the profile
      const credentials = profile.credentials as Record<string, any>;
      if (
        !credentials.accessKeyId ||
        !credentials.secretAccessKey ||
        !credentials.region
      ) {
        throw new AppError(
          "Missing required AWS credentials",
          400,
          "MISSING_AWS_CREDENTIALS"
        );
      }

      // Get the sender email from required fields
      const requiredFields = profile.requiredFields as Record<string, any>;
      if (!requiredFields.fromEmail) {
        throw new AppError(
          "Sender email not found in profile required fields",
          400,
          "MISSING_FROM_EMAIL"
        );
      }

      // Initialize SES client
      const sesClient = new SESClient({
        region: credentials.region,
        credentials: {
          accessKeyId: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
        },
      });

      // Construct the email parameters
      const params = {
        Source: requiredFields.fromEmail,
        Destination: {
          ToAddresses: [emailOptions.to],
        },
        Message: {
          Subject: {
            Data: emailOptions.subject,
            Charset: "UTF-8",
          },
          Body: {
            Html: {
              Data: emailOptions.html,
              Charset: "UTF-8",
            },
          },
        },
        ReplyToAddresses: requiredFields.replyToEmail
          ? [requiredFields.replyToEmail]
          : [requiredFields.fromEmail],
      };

      // Send the email
      const command = new SendEmailCommand(params);
      const response = await sesClient.send(command);

      if (response.$metadata.httpStatusCode !== 200) {
        throw new AppError(
          "Failed to send email through AWS SES",
          500,
          "SES_SEND_ERROR"
        );
      }

      logger.info(
        "email",
        `Email sent successfully via AWS SES. MessageId: ${response.MessageId}`
      );
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }

      // Handle AWS-specific errors
      if (error.name === "MessageRejected") {
        throw new AppError(
          `Email rejected by AWS SES: ${error.message}`,
          400,
          "SES_MESSAGE_REJECTED"
        );
      }

      if (error.name === "ThrottlingException") {
        throw new AppError(
          "AWS SES rate limit exceeded",
          429,
          "SES_RATE_LIMIT_EXCEEDED"
        );
      }

      throw new AppError(
        `Failed to send email via AWS SES: ${error.message}`,
        500,
        "SES_ERROR"
      );
    }
  }

  private findEmailInProperties(
    properties: Record<string, any>
  ): string | null {
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
      // @ts-ignore
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
      // @ts-ignore
      populatedTemplate = populatedTemplate.replace(
        new RegExp(placeholder, "g"),
        value
      );
    }

    return populatedTemplate;
  }
}
