import { Request as ExpressRequest } from "express";
export interface AuthRequest {
  email: string;
  password?: string;
  name?: string;
}

export interface AuthData {
  token: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    currentOrganizationId: string;
    role: string;
  };
}

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
