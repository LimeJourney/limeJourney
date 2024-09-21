import { JourneyManagementService } from "../../../services/journeyService";

const journeyService = new JourneyManagementService();

export async function fetchJourneyDefinition(journeyId: string) {
  return journeyService.getJourney(journeyId);
}

export async function executeJourneyStep(
  step: any,
  entityId: string,
  organizationId: string
) {
  // Implement step execution logic here
  console.log(
    `Executing step ${step.id} for entity ${entityId} in organization ${organizationId}`
  );
}
