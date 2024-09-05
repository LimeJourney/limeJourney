import { PrismaClient, MessageLog, Prisma } from "@prisma/client";
import { AppError } from "@lime/errors";

const prisma = new PrismaClient();

export class MessageLogService {
  async createLog(
    data: Omit<MessageLog, "id" | "createdAt">
  ): Promise<MessageLog> {
    try {
      return await prisma.messageLog.create({ data });
    } catch (error) {
      throw new AppError(
        "Failed to create message log",
        500,
        "LOG_CREATE_ERROR"
      );
    }
  }

  async getLogsByProfileId(
    profileId: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<MessageLog[]> {
    try {
      return await prisma.messageLog.findMany({
        where: { messagingProfileId: profileId },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      });
    } catch (error) {
      throw new AppError(
        "Failed to fetch message logs",
        500,
        "LOG_FETCH_ERROR"
      );
    }
  }

  async getAnalytics(
    profileId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    try {
      const logs = await prisma.messageLog.findMany({
        where: {
          messagingProfileId: profileId,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const totalCount = logs.length;
      const successCount = logs.filter(
        (log) => log.status === "success"
      ).length;
      const errorCount = logs.filter((log) => log.status === "error").length;

      return {
        totalCount,
        successCount,
        errorCount,
        successRate: totalCount > 0 ? (successCount / totalCount) * 100 : 0,
      };
    } catch (error) {
      throw new AppError(
        "Failed to fetch analytics",
        500,
        "ANALYTICS_FETCH_ERROR"
      );
    }
  }
}
