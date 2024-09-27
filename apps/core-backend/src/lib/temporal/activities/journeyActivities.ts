import { JourneyManagementService } from "../../../services/journeyService";
import { EntityData } from "../../../services/entitiesService";
import { populateHTMLTemplate } from "../helpers";
import { logger } from "@lime/telemetry/logger";

const journeyService = new JourneyManagementService();

export async function fetchJourneyDefinition(journeyId: string) {
  try {
    const journey = await journeyService.getJourney(journeyId);
    logger.debug("temporal", "journey11", { journey });
    if (!journey || !journey.definition) {
      throw new Error(
        `Journey or journey definition not found for ID: ${journeyId}`
      );
    }

    logger.debug("temporal", "journey16", { journey });
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
  logger.debug("temporal", "executeEmailStep", { emailData });
  const populatedHTML = populateHTMLTemplate(emailData.html, entityData);

  console.log("Populated HTML Content:");
  console.log("=======================");
  console.log(populatedHTML);
  console.log("=======================");
  console.log(`HTML Length: ${populatedHTML.length} characters`);
  console.log(
    `Contains placeholders: ${populatedHTML.includes("{{") || populatedHTML.includes("}}")} ({{ or }} found)`
  );
  console.log(`First 100 characters: ${populatedHTML.substring(0, 100)}...`);
  console.log(
    `Last 100 characters: ...${populatedHTML.substring(populatedHTML.length - 100)}`
  );

  console.log(
    "\n==== Executing Email Step ====\n" +
      `Entity ID: ${entityId}\n` +
      `Organization ID: ${organizationId}\n` +
      "Email Data:\n" +
      JSON.stringify(emailData, null, 2) +
      "\n==============================\n"
  );
}
