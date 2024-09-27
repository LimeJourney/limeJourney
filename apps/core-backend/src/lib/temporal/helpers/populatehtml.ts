import { logger } from "@lime/telemetry/logger";
import { EntityData } from "../../../services/entitiesService";

export function populateHTMLTemplate(
  template: string,
  entityData: EntityData
): string {
  const { properties } = entityData;

  logger.debug("temporal", "template", { template });
  // Find all placeholders in the template
  const placeholders = template.match(/{{(\w+)}}/g) || [];

  // Create a map of placeholders to their corresponding values
  const placeholderMap: Record<string, string> = {};

  placeholders.forEach((placeholder) => {
    const key = placeholder.replace(/{{|}}/g, "");
    if (key in properties) {
      placeholderMap[placeholder] = String(properties[key]);
    } else {
      // If the placeholder doesn't match any property, leave it unchanged
      placeholderMap[placeholder] = placeholder;
    }
  });

  // Replace placeholders in the template
  let populatedTemplate = template;
  for (const [placeholder, value] of Object.entries(placeholderMap)) {
    populatedTemplate = populatedTemplate.replace(
      new RegExp(placeholder, "g"),
      value
    );
  }

  return populatedTemplate;
}
