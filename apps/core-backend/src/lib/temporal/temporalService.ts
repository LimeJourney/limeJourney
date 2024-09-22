import {
  Connection,
  Client,
  WorkflowHandle,
  WorkflowIdReusePolicy,
} from "@temporalio/client";
import { v4 as uuidv4 } from "uuid";
import { AppConfig } from "@lime/config";
import { logger } from "@lime/telemetry/logger";
import { JourneyWorkflowParams } from "./workflows/journeyWorkflows";

export const WorkflowRegistry = {
  JourneyWorkflow: (params: JourneyWorkflowParams) => Promise<void>,
} as const;

export type WorkflowName = keyof typeof WorkflowRegistry;
export class TemporalService {
  private static instance: TemporalService;
  private client!: Client;

  private constructor() {}

  public static async getInstance(): Promise<TemporalService> {
    if (!TemporalService.instance) {
      TemporalService.instance = new TemporalService();
      await TemporalService.instance.initClient();
    }
    return TemporalService.instance;
  }

  private async initClient(): Promise<void> {
    try {
      const connection = await Connection.connect({
        address: AppConfig.temporal.address,
      });
      this.client = new Client({
        connection,
        namespace: AppConfig.temporal.namespace,
      });
      logger.info("temporal", "Temporal client initialized successfully");
    } catch (error) {
      logger.error(
        "temporal",
        "Failed to initialize Temporal client",
        error as Error
      );
      throw error;
    }
  }

  public getClient(): Client {
    return this.client;
  }

  public async startWorkflow<N extends WorkflowName>(
    workflowName: N,
    params: Parameters<(typeof WorkflowRegistry)[N]>[0],
    options: {
      taskQueue: string;
      workflowId?: string;
      workflowRunTimeout?: string;
      workflowIdReusePolicy?: WorkflowIdReusePolicy;
    }
  ): Promise<WorkflowHandle> {
    const workflowId = options.workflowId || `${workflowName}-${uuidv4()}`;
    try {
      const handle = await this.client.workflow.start(workflowName, {
        args: [params],
        taskQueue: options.taskQueue,
        workflowId: workflowId,
        workflowRunTimeout: options.workflowRunTimeout,
        workflowIdReusePolicy:
          options.workflowIdReusePolicy ||
          WorkflowIdReusePolicy.WORKFLOW_ID_REUSE_POLICY_ALLOW_DUPLICATE,
      });
      logger.info("temporal", `Started workflow ${workflowName}`, {
        workflowId,
      });
      return handle;
    } catch (error) {
      logger.error(
        "temporal",
        `Failed to start workflow ${workflowName}`,
        error as Error,
        { workflowId }
      );
      throw error;
    }
  }

  public async startJourneyWorkflow(
    params: JourneyWorkflowParams
  ): Promise<WorkflowHandle> {
    return this.startWorkflow("JourneyWorkflow", params, {
      taskQueue: AppConfig.temporal.taskQueue,
      workflowId: `journey-${params.journeyId}-${params.entityId}`,
      //   workflowRunTimeout: "24 hours",
    });
  }

  public async startOrContinueJourneyWorkflow(
    params: JourneyWorkflowParams
  ): Promise<WorkflowHandle> {
    const workflowId = `journey-${params.journeyId}-${params.entityId}`;

    try {
      // Try to fetch an existing workflow
      const existingWorkflow = await this.client.workflow.getHandle(workflowId);
      const status = await existingWorkflow.describe();

      if (status.status.name === "RUNNING") {
        logger.info("temporal", `Workflow ${workflowId} is already running`, {
          workflowId,
        });
        return existingWorkflow;
      }

      // If workflow is completed or failed, start a new one
      return this.startWorkflow("JourneyWorkflow", params, {
        taskQueue: AppConfig.temporal.taskQueue,
        workflowId: workflowId,
        workflowRunTimeout: "24 hours",
      });
    } catch (error) {
      // If workflow doesn't exist, start a new one
      if (error instanceof Error && error.name === "WorkflowNotFoundError") {
        return this.startWorkflow("JourneyWorkflow", params, {
          taskQueue: AppConfig.temporal.taskQueue,
          workflowId: workflowId,
          workflowRunTimeout: "24 hours",
        });
      }
      logger.error(
        "temporal",
        `Failed to start or continue workflow`,
        error as Error,
        { workflowId }
      );
      throw error;
    }
  }

  public async getWorkflowHandle(workflowId: string): Promise<WorkflowHandle> {
    try {
      const handle = await this.client.workflow.getHandle(workflowId);
      logger.debug("temporal", `Retrieved workflow handle`, { workflowId });
      return handle;
    } catch (error) {
      logger.error(
        "temporal",
        `Failed to get workflow handle`,
        error as Error,
        { workflowId }
      );
      throw error;
    }
  }

  public async terminateWorkflow(
    workflowId: string,
    reason: string
  ): Promise<void> {
    try {
      const handle = await this.getWorkflowHandle(workflowId);
      await handle.terminate(reason);
      logger.info("temporal", `Terminated workflow`, { workflowId, reason });
    } catch (error) {
      logger.error("temporal", `Failed to terminate workflow`, error as Error, {
        workflowId,
        reason,
      });
      throw error;
    }
  }

  public async cancelWorkflow(workflowId: string): Promise<void> {
    try {
      const handle = await this.getWorkflowHandle(workflowId);
      await handle.cancel();
      logger.info("temporal", `Cancelled workflow`, { workflowId });
    } catch (error) {
      logger.error("temporal", `Failed to cancel workflow`, error as Error, {
        workflowId,
      });
      throw error;
    }
  }

  public async signalWorkflow(
    workflowId: string,
    signalName: string,
    ...args: any[]
  ): Promise<void> {
    try {
      const handle = await this.getWorkflowHandle(workflowId);
      await handle.signal(signalName, ...args);
      logger.info("temporal", `Sent signal to workflow`, {
        workflowId,
        signalName,
      });
    } catch (error) {
      logger.error(
        "temporal",
        `Failed to send signal to workflow`,
        error as Error,
        { workflowId, signalName }
      );
      throw error;
    }
  }

  public async pauseWorkflow(workflowId: string): Promise<void> {
    try {
      await this.signalWorkflow(workflowId, "PAUSE_SIGNAL");
      logger.info("temporal", `Paused workflow`, { workflowId });
    } catch (error) {
      logger.error("temporal", `Failed to pause workflow`, error as Error, {
        workflowId,
      });
      throw error;
    }
  }

  public async resumeWorkflow(workflowId: string): Promise<void> {
    try {
      await this.signalWorkflow(workflowId, "RESUME_SIGNAL");
      logger.info("temporal", `Resumed workflow`, { workflowId });
    } catch (error) {
      logger.error("temporal", `Failed to resume workflow`, error as Error, {
        workflowId,
      });
      throw error;
    }
  }
}
