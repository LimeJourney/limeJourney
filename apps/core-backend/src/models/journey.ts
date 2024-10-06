import { JsonValue } from "./json";

export type Journey = {
  id: string;
  name: string;
  organizationId: string;
  definition: JsonValue;
  status: JourneyStatus;
  createdAt: Date;
  updatedAt: Date;
  runMultipleTimes: boolean;
};

export const JourneyStatus = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  ARCHIVED: "ARCHIVED",
};

export type JourneyStatus = (typeof JourneyStatus)[keyof typeof JourneyStatus];
