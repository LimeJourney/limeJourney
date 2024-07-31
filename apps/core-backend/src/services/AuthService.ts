import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SignupRequest, LoginRequest, AuthData } from "../models/auth";
import { logger } from "@lime/telemetry/logger";
import { AppConfig } from "@lime/config";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    organizationId: string;
  };
}

interface GoogleAuthData {
  user: {
    id: string;
    email: string;
    name: string;
    organizationId: string;
    role: string;
  };
  token: string;
}

export class AuthService {
  constructor() {
    this.initializeGoogleStrategy();
  }

  private initializeGoogleStrategy() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: AppConfig.google.clientId,
          clientSecret: AppConfig.google.clientSecret,
          callbackURL: `${AppConfig.appUrl}/auth/google/callback`,
        },
        this.handleGoogleAuth.bind(this)
      )
    );
  }

  async signup(data: SignupRequest): Promise<AuthData> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const organization = await prisma.organization.create({
      data: {
        name: `${data.name}'s Organization`,
      },
    });

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        organizationId: organization.id,
        role: "ADMIN",
      },
    });

    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organizationId: user.organizationId,
        role: user.role,
      },
    };
  }

  async login(data: LoginRequest): Promise<AuthData> {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.password) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organizationId: user.organizationId,
        role: user.role,
      },
    };
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, AppConfig.jwtSecret, { expiresIn: "1d" });
  }

  getGoogleAuthMiddleware() {
    return passport.authenticate("google", { scope: ["profile", "email"] });
  }

  handleGoogleCallback(req: any, res: any) {
    return new Promise((resolve, reject) => {
      passport.authenticate("google", { session: false }, (err, data) => {
        if (err || !data) {
          reject(new Error("Google authentication failed"));
        } else {
          resolve(data);
        }
      })(req, res);
    });
  }

  private async handleGoogleAuth(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any
  ) {
    try {
      let user = await prisma.user.findUnique({
        where: { googleId: profile.id },
      });

      if (!user) {
        const organization = await prisma.organization.create({
          data: { name: `${profile.displayName}'s Organization` },
        });

        user = await prisma.user.create({
          data: {
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            isEmailVerified: true,
            organizationId: organization.id,
            role: "ADMIN",
          },
        });
      }

      const token = generateToken(user.id);
      done(null, { user, token });
    } catch (error) {
      done(error);
    }
  }

  async jwtAuthentication(
    request: AuthenticatedRequest,
    securityName: string,
    scopes?: string[]
  ): Promise<any> {
    if (securityName === "jwt") {
      const token = request.headers["authorization"]?.split(" ")[1];

      if (!token) {
        throw new Error("No token provided");
      }

      try {
        const decoded = jwt.verify(token, AppConfig.jwtSecret) as {
          userId: string;
        };
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { id: true, role: true, organizationId: true },
        });

        if (!user) {
          throw new Error("User not found");
        }

        if (scopes && scopes.length > 0 && !scopes.includes(user.role)) {
          throw new Error("Insufficient scope");
        }

        return user;
      } catch (error) {
        throw new Error("Invalid token");
      }
    }
    throw new Error("Invalid security name");
  }
}
