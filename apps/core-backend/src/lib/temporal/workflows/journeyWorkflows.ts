import {
  proxyActivities,
  setHandler,
  condition,
  sleep,
  defineSignal,
} from "@temporalio/workflow";
import type * as activities from "../activities";
import {
  JourneyDefinition,
  JourneyNode,
} from "../../../services/journeyService";
import { EventType } from "@prisma/client";
// import { logger } from "@lime/telemetry/logger";

const {
  fetchJourneyDefinition,
  executeEmailStep,
  updateJourneyAnalytics,
  recordJourneyEvent,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: "60000",
});

export interface JourneyWorkflowParams {
  journeyId: string;
  entityId: string;
  organizationId: string;
  [key: string]: any;
  entityData: any;
}

const PAUSE_SIGNAL = defineSignal<[]>("PAUSE_SIGNAL");
const RESUME_SIGNAL = defineSignal<[]>("RESUME_SIGNAL");

export async function JourneyWorkflow(
  params: JourneyWorkflowParams
): Promise<void> {
  const rawJourneyDefinition = await fetchJourneyDefinition(params.journeyId);

  if (!isJourneyDefinition(rawJourneyDefinition)) {
    throw new Error("Invalid journey definition structure");
  }

  const journeyDefinition: JourneyDefinition = rawJourneyDefinition;

  let isPaused = false;

  setHandler(PAUSE_SIGNAL, () => {
    isPaused = true;
  });

  setHandler(RESUME_SIGNAL, () => {
    isPaused = false;
  });

  await updateJourneyAnalytics(params.journeyId, {
    entityId: params.entityId,
    completionCount: 1,
  });

  await recordJourneyEvent({
    journeyId: params.journeyId,
    entityId: params.entityId,
    nodeId: journeyDefinition.nodes[0].id,
    type: "JOURNEY_STARTED",
    status: "SUCCESS",
  });

  try {
    await executeJourney(journeyDefinition, params, isPaused);

    await recordJourneyEvent({
      journeyId: params.journeyId,
      entityId: params.entityId,
      nodeId: journeyDefinition.nodes[journeyDefinition.nodes.length - 1].id,
      type: "JOURNEY_COMPLETED",
      status: "SUCCESS",
    });

    await updateJourneyAnalytics(params.journeyId, {
      entityId: params.entityId,
      completionCount: 1,
    });
  } catch (error: any) {
    await recordJourneyEvent({
      journeyId: params.journeyId,
      entityId: params.entityId,
      nodeId: "",
      type: "ERROR_OCCURRED",
      status: "ERROR",
      error: error.message,
    });

    await updateJourneyAnalytics(params.journeyId, {
      entityId: params.entityId,
      errorCount: 1,
    });
  }
}

function isJourneyDefinition(obj: unknown): obj is JourneyDefinition {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "nodes" in obj &&
    Array.isArray((obj as JourneyDefinition).nodes) &&
    "edges" in obj &&
    Array.isArray((obj as JourneyDefinition).edges)
  );
}

async function executeJourney(
  journeyDefinition: JourneyDefinition,
  params: JourneyWorkflowParams,
  isPaused: boolean
): Promise<void> {
  const { nodes, edges } = journeyDefinition;
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  let currentNodeId = nodes.find((node) => node.type === "triggerNode")?.id;

  while (currentNodeId) {
    await condition(() => !isPaused);

    const currentNode = nodeMap.get(currentNodeId);
    if (!currentNode) {
      break;
    }

    try {
      if (currentNode.type === "waitNode") {
        const waitResult = await handleWaitNode(currentNode, params);
        if (waitResult === "scheduled") {
          return;
        }
      } else {
        await executeNode(currentNode, params);
      }

      if (
        currentNode.type !== "exitNode" &&
        currentNode.type !== "triggerNode"
      ) {
        await recordJourneyEvent({
          journeyId: params.journeyId,
          entityId: params.entityId,
          nodeId: currentNodeId,
          type: `${currentNode.type.replace(/Node$/, "").toUpperCase()}_COMPLETED` as EventType,
          status: "SUCCESS",
        });
      }

      // Update step conversion rates
      await updateJourneyAnalytics(params.journeyId, {
        stepCompletions: { [currentNodeId]: 1 },
        completedStepId: currentNodeId,
        entityId: params.entityId,
      });
    } catch (error: any) {
      await recordJourneyEvent({
        journeyId: params.journeyId,
        entityId: params.entityId,
        nodeId: currentNodeId,
        type: "ERROR_OCCURRED",
        status: "ERROR",
        error: error.message,
      });

      await updateJourneyAnalytics(params.journeyId, {
        entityId: params.entityId,
        errorCount: 1,
      });
      throw error;
    }

    const nextEdge = edges.find((edge) => edge.source === currentNodeId);
    currentNodeId = nextEdge?.target;
  }
}

async function executeNode(
  node: JourneyNode,
  params: JourneyWorkflowParams
): Promise<void> {
  switch (node.type) {
    case "emailNode":
      await executeEmailStep(
        node.data,
        params.entityId,
        params.organizationId,
        params.entityData
      );
      break;
    case "exitNode":
      return;
    default:
      // Do nothing for other node types
      break;
  }
}

function calculateWaitUntil(waitData: any): Date | null {
  const { waitType, timeUnit, duration, specificDate } = waitData;
  const now = new Date();

  if (waitType === "duration") {
    let milliseconds = 0;
    switch (timeUnit) {
      case "days":
        milliseconds = parseInt(duration) * 24 * 60 * 60 * 1000;
        break;
      case "hours":
        milliseconds = parseInt(duration) * 60 * 60 * 1000;
        break;
      case "minutes":
        milliseconds = parseInt(duration) * 60 * 1000;
        break;
      default:
        return null;
    }
    return new Date(now.getTime() + milliseconds);
  } else if (waitType === "specificDate") {
    return new Date(specificDate);
  } else {
    return null;
  }
}

async function handleWaitNode(
  node: JourneyNode,
  params: JourneyWorkflowParams
): Promise<"completed" | "scheduled"> {
  const waitUntil = calculateWaitUntil(node.data);
  if (!waitUntil) {
    return "completed";
  }

  const now = new Date();
  const msToWait = waitUntil.getTime() - now.getTime();

  if (msToWait <= 0) {
    return "completed";
  } else {
    await sleep(msToWait);
    return "completed";
  }
}
