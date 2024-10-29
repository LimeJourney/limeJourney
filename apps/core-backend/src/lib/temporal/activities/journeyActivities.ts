import { JourneyManagementService } from "../../../services/journeyService";
import { EntityData } from "../../../services/entitiesService";
import { EgressService } from "../../../services/egressService";
import { EventStatus, EventType, PrismaClient, Prisma } from "@prisma/client";

const journeyService = new JourneyManagementService();
const egressService = new EgressService();
const prisma = new PrismaClient();
export async function fetchJourneyDefinition(journeyId: string) {
  try {
    const journey = await journeyService.getJourney(journeyId);
    if (!journey || !journey.definition) {
      throw new Error(
        `Journey or journey definition not found for ID: ${journeyId}`
      );
    }

    return journey.definition;
  } catch (error) {
    console.error(
      `Error fetching journey definition for ID ${journeyId}:`,
      error
    );
    throw error;
  }
}

export async function executeEmailStep(
  emailData: any,
  entityId: string,
  organizationId: string,
  entityData: EntityData
): Promise<void> {
  await egressService.handleJourneyEmail(emailData, entityData);
}

export async function updateJourneyAnalytics(
  journeyId: string,
  data: {
    entityId: string;
    completionCount?: number;
    errorCount?: number;
    completedStepId?: string;
    stepCompletions?: Record<string, number>;
  }
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // First, fetch the current analytics
    const currentAnalytics = await tx.journeyAnalytics.findUnique({
      where: { journeyId },
      select: { stepCompletions: true, totalUniqueUsers: true, runCount: true },
    });

    // Prepare the new stepCompletions
    let newStepCompletions: Record<string, number> =
      (currentAnalytics?.stepCompletions as Record<string, number>) || {};
    if (data.completedStepId) {
      newStepCompletions[data.completedStepId] =
        (newStepCompletions[data.completedStepId] || 0) + 1;
    }

    // Check if this is a new unique user

    const existingUserEvent = await tx.journeyEvent.findFirst({
      where: {
        journeyId,
        entityId: data.entityId,
        type: "JOURNEY_STARTED",
      },
    });
    const isNewUser = !existingUserEvent;
    // Now update the analytics
    await tx.journeyAnalytics.upsert({
      where: { journeyId },
      create: {
        journeyId,
        totalUniqueUsers: isNewUser ? 1 : 0,
        runCount: 1,
        completionCount: data.completionCount || 0,
        errorCount: data.errorCount || 0,
        stepCompletions: newStepCompletions,
      },
      update: {
        totalUniqueUsers: {
          increment: isNewUser ? 1 : 0,
        },
        runCount: {
          increment: 1,
        },
        completionCount: {
          increment: data.completionCount || 0,
        },
        errorCount: {
          increment: data.errorCount || 0,
        },
        stepCompletions: newStepCompletions,
      },
    });
  });
}

export async function recordJourneyEvent(eventData: {
  journeyId: string;
  entityId: string;
  nodeId: string;
  type: string;
  status: string;
  error?: string;
}): Promise<void> {
  await prisma.journeyEvent.create({
    data: {
      journeyId: eventData.journeyId,
      entityId: eventData.entityId,
      nodeId: eventData.nodeId,
      type: eventData.type as EventType,
      status: eventData.status as EventStatus,
      error: eventData.error,
      data: {},
    },
  });
}
