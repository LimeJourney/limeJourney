import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { AppConfig } from "@lime/config";
import { AuthError, NotFoundError } from "@lime/errors";

const prisma = new PrismaClient();

// Type definitions
export interface JWTAuthenticatedUser {
  id: string;
  role: string;
  currentOrganizationId: string | null;
}

export interface APIKeyAuthenticatedUser {
  apiKeyId: string;
  organizationId: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JWTAuthenticatedUser | APIKeyAuthenticatedUser;
}

export type AuthenticationResult =
  | JWTAuthenticatedUser
  | APIKeyAuthenticatedUser;

// Type guards
export function isJWTAuthenticatedUser(
  user: any
): user is JWTAuthenticatedUser {
  return (
    user &&
    typeof user.id === "string" &&
    typeof user.role === "string" &&
    (typeof user.currentOrganizationId === "string" ||
      user.currentOrganizationId === null)
  );
}

export function isAPIKeyAuthenticatedUser(
  user: any
): user is APIKeyAuthenticatedUser {
  return (
    user &&
    typeof user.apiKeyId === "string" &&
    typeof user.organizationId === "string"
  );
}

export function isAuthenticatedRequest(
  request: Request
): request is AuthenticatedRequest {
  return (
    "user" in request &&
    (isJWTAuthenticatedUser(request.user) ||
      isAPIKeyAuthenticatedUser(request.user))
  );
}

// Updated expressAuthentication function
export async function expressAuthentication(
  req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
  securityName: string,
  scopes?: string[],
  res?: Response
): Promise<AuthenticationResult> {
  const request = req as AuthenticatedRequest;

  if (securityName === "jwt") {
    const token = request.headers["authorization"]?.split(" ")[1];

    if (!token) {
      throw new AuthError("No token provided", 401, "NO_TOKEN_PROVIDED");
    }

    try {
      const decoded = jwt.verify(token, AppConfig.jwtSecret) as {
        userId: string;
      };
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, role: true, currentOrganizationId: true },
      });

      if (!user) {
        throw new NotFoundError("User not found", 404, "USER_NOT_FOUND");
      }

      if (scopes && scopes.length > 0 && !scopes.includes(user.role)) {
        throw new AuthError("Insufficient scope", 403, "INSUFFICIENT_SCOPE");
      }

      const authenticatedUser: JWTAuthenticatedUser = {
        id: user.id,
        role: user.role,
        currentOrganizationId: user.currentOrganizationId,
      };

      request.user = authenticatedUser;
      return authenticatedUser;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthError("Invalid token", 401, "INVALID_TOKEN");
      }
      throw error;
    }
  }

  if (securityName === "apiKey") {
    const apiKey = request.headers["x-api-key"]?.toString().split(" ")[1];

    if (!apiKey) {
      throw new AuthError("No API key provided", 401, "NO_API_KEY_PROVIDED");
    }

    try {
      const foundApiKey = await prisma.apiKey.findUnique({
        where: { key: apiKey },
        include: { organization: true },
      });

      if (!foundApiKey) {
        throw new NotFoundError("API key not found", 404, "API_KEY_NOT_FOUND");
      }

      if (!foundApiKey.isActive) {
        throw new AuthError("API key is inactive", 403, "INACTIVE_API_KEY");
      }

      if (foundApiKey.expiresAt && foundApiKey.expiresAt < new Date()) {
        throw new AuthError("API key has expired", 403, "EXPIRED_API_KEY");
      }

      await prisma.apiKey.update({
        where: { id: foundApiKey.id },
        data: { lastUsedAt: new Date() },
      });

      if (foundApiKey.organization.subscriptionStatus !== "ACTIVE") {
        throw new AuthError(
          "Organization subscription is not active",
          403,
          "INACTIVE_SUBSCRIPTION"
        );
      }

      const authenticatedUser: APIKeyAuthenticatedUser = {
        apiKeyId: foundApiKey.id,
        organizationId: foundApiKey.organizationId,
      };

      request.user = authenticatedUser;
      return authenticatedUser;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof AuthError) {
        throw error;
      }
      throw new AuthError(
        "Authentication failed",
        401,
        "AUTHENTICATION_FAILED"
      );
    }
  }

  throw new AuthError("Invalid security name", 400, "INVALID_SECURITY_NAME");
}
