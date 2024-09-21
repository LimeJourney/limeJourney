import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "../activities";

export interface JourneyWorkflowParams {
  journeyId: string;
  entityId: string;
  organizationId: string;
  [key: string]: any;
}

const { fetchJourneyDefinition, executeJourneyStep } = proxyActivities<
  typeof activities
>({});

export async function JourneyWorkflow(
  params: JourneyWorkflowParams
): Promise<void> {
  const journeyDefinition = await fetchJourneyDefinition(params.journeyId);
  console.log("Journey Definition:");
  console.log(JSON.stringify(journeyDefinition, null, 2));
  //   for (const step of journeyDefinition?.steps) {
  //     await executeJourneyStep(step, params.entityId, params.organizationId);
  //   }
}
