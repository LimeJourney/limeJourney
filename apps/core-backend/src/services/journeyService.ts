import { PrismaClient, Journey } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { OrchestrationService } from "./ochestrationService";
import { json } from "stream/consumers";

const prisma = new PrismaClient();

export interface JourneyNode {
  id: string;
  type: string;
  data: any;
}

export interface JourneyEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

export interface JourneyDefinition {
  nodes: JourneyNode[];
  edges: JourneyEdge[];
}

export interface CreateJourneyDTO {
  name: string;
  organizationId: string;
  definition: JourneyDefinition;
  runMultipleTimes: boolean;
  status?: "DRAFT" | "ACTIVE" | "PAUSED" | "ARCHIVED";
}

export interface UpdateJourneyDTO {
  id: string;
  organizationId: string;
  name?: string;
  //   definition?: JourneyDefinition;
  status?: "DRAFT" | "ACTIVE" | "PAUSED" | "ARCHIVED";
  //   runMultipleTimes?: boolean;
}

export interface StepMetric {
  total: number;
  completed: number;
}

export interface JourneyMetrics {
  totalUsers: number;
  completedUsers: number;
  completionRate: number;
  averageCompletionTime: number;
  stepMetrics: {
    [nodeId: string]: StepMetric;
  };
}

export interface JourneyActivity {
  id: string;
  userId: string;
  nodeId: string;
  nodeName: string;
  type: string;
  status: string;
  timestamp: Date;
  data?: any;
}

export interface JourneyWithMetrics extends Journey {
  metrics: {
    totalUsers: number;
    completionRate: number;
  };
}

export class JourneyManagementService {
  private ochestrationService: OrchestrationService;

  constructor() {
    this.ochestrationService = new OrchestrationService();
  }

  async createJourney(journeyData: CreateJourneyDTO): Promise<Journey> {
    const journey = await prisma.journey.create({
      data: {
        id: uuidv4(),
        name: journeyData.name,
        organizationId: journeyData.organizationId,
        definition: JSON.parse(JSON.stringify(journeyData.definition)),
        status: journeyData.status || "DRAFT",
        runMultipleTimes: journeyData.runMultipleTimes,
      },
    });

    await prisma.journeyAnalytics.create({
      data: {
        journeyId: journey.id,
        totalUniqueUsers: 0,
        runCount: 0,
        completionCount: 0,
        stepCompletions: {},
      },
    });

    // Only register triggers if the status is not DRAFT
    if (
      journey.status !== "DRAFT" &&
      journey.status !== "ARCHIVED" &&
      journey.status !== "PAUSED"
    ) {
      await this.ochestrationService.registerTriggers(journey);
    }

    return journey;
  }

  async getJourneyMetrics(journeyId: string): Promise<JourneyMetrics> {
    try {
      const journey = await this.getJourney(journeyId);
      if (!journey || !journey.definition) {
        throw new Error("Journey or definition not found");
      }

      const rawJourneyDefinition = journey.definition;
      if (!this.isJourneyDefinition(rawJourneyDefinition)) {
        throw new Error("Invalid journey definition structure");
      }

      const parsedDefinition: JourneyDefinition = rawJourneyDefinition;

      const analytics = await prisma.journeyAnalytics.findUnique({
        where: { journeyId },
      });

      if (!analytics) {
        throw new Error("Journey analytics not found");
      }

      // Parse the journey definition
      const stepCompletions = analytics.stepCompletions as Record<
        string,
        number
      >;

      const stepMetrics: { [nodeId: string]: StepMetric } = {};
      parsedDefinition.nodes.forEach((node) => {
        stepMetrics[node.id] = {
          total: analytics.runCount,
          completed: stepCompletions[node.id] || 0,
        };
      });

      // const averageCompletionTime =
      //   await this.calculateAverageCompletionTime(journeyId);

      return {
        totalUsers: analytics.totalUniqueUsers,
        completedUsers: analytics.completionCount,
        completionRate:
          analytics.runCount > 0
            ? Number(
                (
                  (analytics.completionCount / analytics.runCount) *
                  100
                ).toFixed(2)
              )
            : 0,
        averageCompletionTime: 0,
        stepMetrics,
      };
    } catch (error) {
      console.error("Error in getJourneyMetrics:", error);
      throw new Error("Failed to retrieve journey metrics");
    }
  }

  // private async calculateAverageCompletionTime(
  //   journeyId: string
  // ): Promise<number> {
  //   const completionTimes = await prisma.$queryRaw<
  //     Array<{ completion_time: number }>
  //   >`
  //         SELECT
  //           EXTRACT(EPOCH FROM (MAX(CASE WHEN type = 'JOURNEY_COMPLETED' THEN timestamp END) -
  //                               MIN(CASE WHEN type = 'JOURNEY_STARTED' THEN timestamp END))) as completion_time
  //         FROM JourneyEvent
  //         WHERE journeyId = ${journeyId}
  //         GROUP BY userId
  //         HAVING MAX(CASE WHEN type = 'JOURNEY_COMPLETED' THEN timestamp END) IS NOT NULL
  //       `;

  //   if (completionTimes.length === 0) return 0;

  //   const totalTime = completionTimes.reduce(
  //     (sum, record) => sum + record.completion_time,
  //     0
  //   );
  //   return totalTime / completionTimes.length;
  // }

  async updateJourney(journeyData: UpdateJourneyDTO): Promise<Journey> {
    const updateData: { name?: string; status?: Journey["status"] } = {};

    if (journeyData.name && journeyData.name.trim() !== "") {
      updateData.name = journeyData.name;
    }

    if (journeyData.status && journeyData.status.trim() !== "") {
      updateData.status = journeyData.status as Journey["status"];
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error("No valid update data provided");
    }

    const updatedJourney = await prisma.journey.update({
      where: { id: journeyData.id, organizationId: journeyData.organizationId },
      data: updateData,
    });

    // Handle trigger registration/unregistration based on status change
    if (journeyData.status) {
      await this.handleJourneyStatusChange(updatedJourney);
    }

    return updatedJourney;
  }

  private async handleJourneyStatusChange(journey: Journey): Promise<void> {
    if (journey.status === "ACTIVE") {
      await this.ochestrationService.registerTriggers(journey);
    } else if (journey.status === "PAUSED" || journey.status === "ARCHIVED") {
      await this.ochestrationService.unregisterTriggers(journey);
    }
  }

  async deleteJourney(journeyId: string): Promise<void> {
    await prisma.journey.delete({
      where: { id: journeyId },
    });
  }

  async getJourney(journeyId: string): Promise<Journey | null> {
    return prisma.journey.findUnique({
      where: { id: journeyId },
    });
  }

  async listJourneys(
    organizationId: string,
    status?: string
  ): Promise<JourneyWithMetrics[]> {
    const where: any = { organizationId };
    if (status) {
      where.status = status;
    }

    const journeys = await prisma.journey.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { analytics: true },
    });

    return journeys.map((journey) => ({
      ...journey,
      metrics: {
        totalUsers: journey.analytics?.totalUniqueUsers || 0,
        completionRate: journey.analytics?.runCount
          ? (journey.analytics.completionCount / journey.analytics.runCount) *
            100
          : 0,
      },
    }));
  }

  async getRecentJourneyActivity(
    journeyId: string,
    limit: number = 10
  ): Promise<JourneyActivity[]> {
    try {
      const journey = await this.getJourney(journeyId);
      if (!journey || !journey.definition) {
        throw new Error("Journey or definition not found");
      }

      const rawJourneyDefinition = journey.definition;
      if (!this.isJourneyDefinition(rawJourneyDefinition)) {
        throw new Error("Invalid journey definition structure");
      }

      const parsedDefinition: JourneyDefinition = rawJourneyDefinition;

      const events = await prisma.journeyEvent.findMany({
        where: { journeyId },
        orderBy: { timestamp: "desc" },
        take: limit,
      });

      return events.map((event) => {
        const node = parsedDefinition.nodes.find((n) => n.id === event.nodeId);
        return {
          id: event.id,
          userId: event.entityId,
          nodeId: event.nodeId,
          nodeName: node?.data.label || "Unknown Step",
          type: event.type,
          status: event.status,
          timestamp: event.timestamp,
          data: event.data,
        };
      });
    } catch (error) {
      console.error("Error in getRecentJourneyActivity:", error);
      throw new Error("Failed to retrieve recent journey activity");
    }
  }

  async getJourneyActivityFeed(
    journeyId: string,
    page: number = 1,
    pageSize: number = 20,
    organizationId: string
  ): Promise<{ activities: JourneyActivity[]; totalCount: number }> {
    try {
      const journey = await this.getJourney(journeyId);
      if (!journey || !journey.definition) {
        throw new Error("Journey or definition not found");
      }

      const skip = (page - 1) * pageSize;

      // Parse the journey definition
      const parsedDefinition: JourneyDefinition = JSON.parse(
        journey.definition as string
      );

      const [events, totalCount] = await Promise.all([
        prisma.journeyEvent.findMany({
          where: {
            journeyId,
            journey: { organizationId: organizationId },
          },
          orderBy: { timestamp: "desc" },
          skip,
          take: pageSize,
        }),
        prisma.journeyEvent.count({
          where: {
            journeyId,
            journey: { organizationId: organizationId },
          },
        }),
      ]);

      const activities = events.map((event) => {
        const node = parsedDefinition.nodes.find((n) => n.id === event.nodeId);
        return {
          id: event.id,
          userId: event.entityId,
          nodeId: event.nodeId,
          nodeName: node?.data.label || "Unknown Step",
          type: event.type,
          status: event.status,
          timestamp: event.timestamp,
          data: event.data,
        };
      });

      return { activities, totalCount };
    } catch (error) {
      console.error("Error in getJourneyActivityFeed:", error);
      throw new Error("Failed to retrieve journey activity feed");
    }
  }

  async getJourneyActivitySummary(
    journeyId: string,
    timeframe: "day" | "week" | "month" = "day",
    organizationId: string
  ): Promise<{ [key: string]: number }> {
    try {
      const timeframeToHours = {
        day: 24,
        week: 168,
        month: 720,
      };

      const events = await prisma.$queryRaw<
        Array<{ type: string; count: number }>
      >`
        SELECT je.type, COUNT(*) as count
        FROM JourneyEvent je
        JOIN Journey j ON je.journeyId = j.id
        WHERE je.journeyId = ${journeyId}
        AND j.organizationId = ${organizationId}
          AND je.timestamp > NOW() - INTERVAL '${timeframeToHours[timeframe]} HOURS'
        GROUP BY je.type
      `;

      return events.reduce(
        (acc, { type, count }) => {
          acc[type] = Number(count);
          return acc;
        },
        {} as { [key: string]: number }
      );
    } catch (error) {
      console.error("Error in getJourneyActivitySummary:", error);
      throw new Error("Failed to retrieve journey activity summary");
    }
  }

  private isJourneyDefinition(obj: unknown): obj is JourneyDefinition {
    return (
      typeof obj === "object" &&
      obj !== null &&
      "nodes" in obj &&
      Array.isArray((obj as JourneyDefinition).nodes) &&
      "edges" in obj &&
      Array.isArray((obj as JourneyDefinition).edges)
    );
  }
}
