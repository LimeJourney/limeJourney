import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppConfig } from "@lime/config";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { AuthData, AuthRequest, JWTAuthenticatedUser } from "../models/auth";

const prisma = new PrismaClient();

export class AuthService {
  // constructor() {
  //   // this.initializeGoogleStrategy();
  // }

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

  async authenticate(data: AuthRequest): Promise<AuthData> {
    let user = await prisma.user.findUnique({ where: { email: data.email } });

    const userCurrentOrganizationId = user?.currentOrganizationId;
    if (!user) {
      // User doesn't exist, create a new account
      let organization = null;
      if (!data.invitationId) {
        organization = await prisma.organization.create({
          data: { name: `${data.name || "New"}'s Organization` },
        });
      }

      const hashedPassword = data.password
        ? await bcrypt.hash(data.password, 10)
        : null;

      user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name || data.email.split("@")[0],
          currentOrganizationId: organization.id || "",
          role: "ADMIN",
        },
      });

      if (!data.invitationId) {
        const organizationMember = await prisma.organizationMember.create({
          data: {
            userId: user.id,
            organizationId: organization.id,
            role: "ADMIN",
          },
        });
      }
    } else if (data.password) {
      // User exists, verify password
      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password || ""
      );
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }
    } else {
      // Password-less login attempt for existing user
      throw new Error("Password required for existing account");
    }

    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || "",
        currentOrganizationId: user.currentOrganizationId || "",
        role: user.role,
      },
    };
  }

  private generateToken(userId: string): string {
    console.log("AppConfig.jwtSecret", AppConfig.jwtSecret);
    return jwt.sign({ userId }, AppConfig.jwtSecret, { expiresIn: "1d" });
  }

  getGoogleAuthMiddleware() {
    return passport.authenticate("google", { scope: ["profile", "email"] });
  }

  handleGoogleCallback(req: any, res: any): Promise<AuthData> {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "google",
        { session: false },
        async (err: Error | null, googleProfile: any) => {
          if (err || !googleProfile) {
            reject(new Error("Google authentication failed"));
          } else {
            try {
              const authData = await this.authenticate({
                email: googleProfile.emails[0].value,
                name: googleProfile.displayName,
              });
              resolve(authData);
            } catch (error) {
              reject(error);
            }
          }
        }
      )(req, res);
    });
  }

  private async handleGoogleAuth(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any
  ) {
    try {
      const authData = await this.authenticate({
        email: profile.emails[0].value,
        name: profile.displayName,
      });
      done(null, authData);
    } catch (error) {
      done(error);
    }
  }

  async getCurrentUser(userId: string): Promise<JWTAuthenticatedUser | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.currentOrganizationId) {
      return null;
    }

    const organizationMember = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: user.currentOrganizationId,
        },
      },
    });

    return {
      id: user.id,
      currentOrganizationId: user.currentOrganizationId,
      role: organizationMember?.role || "MEMBER",
    };
  }
}
