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
// import { logger } from "@lime/telemetry/logger";

const { fetchJourneyDefinition, executeEmailStep } = proxyActivities<
  typeof activities
>({
  startToCloseTimeout: "60000",
});

class Logger {
  public debug(message: string, data: any, ...rest: any[]) {
    console.log(message, data, rest);
  }

  public warn(message: string, data: any, ...rest: any[]) {
    console.warn(message, data, rest);
  }
}

const logger = new Logger();

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
  logger.debug("temporal", "Journey Workflow Params:", { params });
  const rawJourneyDefinition = await fetchJourneyDefinition(params.journeyId);
  logger.debug("temporal", "rawJourneyDefinition 36", { rawJourneyDefinition });
  logger.debug("temporal", "Raw Journey Definition:", { rawJourneyDefinition });

  if (!isJourneyDefinition(rawJourneyDefinition)) {
    throw new Error("Invalid journey definition structure");
  }

  const journeyDefinition: JourneyDefinition = rawJourneyDefinition;

  logger.debug("temporal", "Journey Definition Fetched From the Workflow:", {
    journeyDefinition,
  });

  let isPaused = false;

  setHandler(PAUSE_SIGNAL, () => {
    isPaused = true;
    logger.debug("temporal", "Journey paused", { journeyId: params.journeyId });
  });

  setHandler(RESUME_SIGNAL, () => {
    isPaused = false;
    logger.debug("temporal", "Journey resumed", {
      journeyId: params.journeyId,
    });
  });

  await executeJourney(journeyDefinition, params, isPaused);
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

  logger.debug("temporal", "Starting Journey Execution", {
    journeyId: params.journeyId,
    entityId: params.entityId,
  });

  let currentNodeId = nodes.find((node) => node.type === "triggerNode")?.id;

  while (currentNodeId) {
    await condition(() => !isPaused);

    const currentNode = nodeMap.get(currentNodeId);
    if (!currentNode) {
      logger.warn("temporal", "Node not found, ending journey", {
        nodeId: currentNodeId,
        journeyId: params.journeyId,
      });
      break;
    }

    if (currentNode.type === "waitNode") {
      const waitResult = await handleWaitNode(currentNode, params);
      if (waitResult === "scheduled") {
        logger.debug("temporal", "Journey scheduled for later execution", {
          journeyId: params.journeyId,
          entityId: params.entityId,
        });
        return;
      }
    } else {
      await executeNode(currentNode, params);
    }

    const nextEdge = edges.find((edge) => edge.source === currentNodeId);
    currentNodeId = nextEdge?.target;
  }

  logger.debug("temporal", "Journey execution completed", {
    journeyId: params.journeyId,
    entityId: params.entityId,
  });
}

async function executeNode(
  node: JourneyNode,
  params: JourneyWorkflowParams
): Promise<void> {
  logger.debug("temporal", "Executing node", {
    nodeType: node.type,
    journeyId: params.journeyId,
    entityId: params.entityId,
  });

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
      logger.debug("temporal", "Skipping execution for node type", {
        nodeType: node.type,
        journeyId: params.journeyId,
      });
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
        logger.warn("temporal", "Unknown time unit", { timeUnit });
        return null;
    }
    return new Date(now.getTime() + milliseconds);
  } else if (waitType === "specificDate") {
    return new Date(specificDate);
  } else {
    logger.warn("temporal", "Unknown wait type", { waitType });
    return null;
  }
}

async function handleWaitNode(
  node: JourneyNode,
  params: JourneyWorkflowParams
): Promise<"completed" | "scheduled"> {
  const waitUntil = calculateWaitUntil(node.data);
  if (!waitUntil) {
    logger.warn("temporal", "Invalid wait node data", {
      nodeData: node.data,
      journeyId: params.journeyId,
    });
    return "completed";
  }

  const now = new Date();
  const msToWait = waitUntil.getTime() - now.getTime();

  if (msToWait <= 0) {
    logger.debug("temporal", "Wait time has already passed", {
      journeyId: params.journeyId,
      entityId: params.entityId,
    });
    return "completed";
  } else {
    logger.debug("temporal", "Waiting for specified duration", {
      msToWait,
      journeyId: params.journeyId,
      entityId: params.entityId,
    });
    await sleep(msToWait);
    return "completed";
  }
}
