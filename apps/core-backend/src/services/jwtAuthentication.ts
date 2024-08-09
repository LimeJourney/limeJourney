import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { AppConfig } from "@lime/config";
import { AuthError, NotFoundError } from "@lime/errors";
import { AuthenticatedRequest } from "../models/auth";

const prisma = new PrismaClient();

export async function expressAuthentication(
  request: AuthenticatedRequest,
  securityName: string,
  scopes?: string[]
): Promise<any> {
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

      return user;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthError("Invalid token", 401, "INVALID_TOKEN");
      }
      throw error;
    }
  }
  throw new AuthError("Invalid security name", 400, "INVALID_SECURITY_NAME");
}
