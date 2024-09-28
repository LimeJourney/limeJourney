import Anthropic from "@anthropic-ai/sdk";
import { EntityService, EntityData } from "./entitiesService";
import { EventService } from "./eventsService";
import { PrismaClient } from "@prisma/client";
import { EventData } from "../models/events";
import { clickhouseManager } from "../lib/clickhouse";
import { ClickHouseClient } from "@clickhouse/client";
import { AppConfig } from "@lime/config";
import {
  LogicalOperator,
  SegmentCondition,
  SegmentCriterionType,
  SegmentOperator,
} from "../models/segmentation";

const prisma = new PrismaClient();

export interface InsightQuery {
  organizationId: string;
  query: string;
}

export interface InsightResponse {
  insight: string;
  confidence: number;
}

export interface RecentQuery {
  query: string;
  response: string;
  createdAt: Date;
}

export interface UniqueEvent {
  name: string;
  count: number;
}

interface GeneratedSegment {
  title: string;
  description: string;
  conditions: SegmentCondition[];
}

export interface OrganizationInsights {
  recentQueries: RecentQuery[];
  uniqueEvents: { [eventName: string]: number };
  totalEntities: number;
  totalEvents: number;
  averageEventsPerEntity: number;
  activeEntitiesLast30Days: number;
}

export class AIInsightsService {
  private anthropic: Anthropic;
  private entityService: EntityService;
  private eventService: EventService;
  private clickhouse: ClickHouseClient;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: AppConfig.anthropic.apiKey,
    });
    this.entityService = new EntityService();
    this.eventService = new EventService();
    this.clickhouse = clickhouseManager.getClient();
  }

  async getInsights({
    organizationId,
    query,
  }: InsightQuery): Promise<InsightResponse> {
    // Fetch relevant data
    const entities: EntityData[] =
      await this.entityService.listEntities(organizationId);
    const events: EventData[] =
      await this.eventService.getEvents(organizationId);

    // Prepare context for the AI
    const context = this.prepareContext(entities, events);

    // Generate AI response
    const response = await this.anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 4096,
      system: this.constructSystemPrompt(context),
      messages: [{ role: "user", content: query }],
    });

    const insight = response.content[0].text;

    // Persist the query and response
    await this.persistQueryAndResponse(organizationId, query, insight);

    // Extract confidence (you might want to implement a more sophisticated method)
    const confidence = this.extractConfidence(insight);

    return { insight, confidence };
  }

  private prepareContext(entities: EntityData[], events: EventData[]): string {
    return `
      Number of entities: ${entities.length}
      Number of events: ${events.length}

      Entity sample:
      ${JSON.stringify(entities, null, 2)}

      Event sample:
      ${JSON.stringify(events, null, 2)}

      Full entity and event data is available for analysis.
    `;
  }

  private constructSystemPrompt(context: string): string {
    return `
      You are an AI assistant specializing in analyzing entity and event data for organizations.
      You have access to the following data:

      ${context}

      Please analyze this data to answer the user's question.
      If you need to perform any calculations or data analysis, please do so step by step.
      If you're not confident about any part of your answer, please indicate that.
      End your response with a confidence score between 0 and 1, where 1 is completely confident.
    `;
  }

  private extractConfidence(insight: string): number {
    const confidenceRegex = /Confidence:\s*(0?\.\d+|1(\.0+)?)/;
    const match = insight.match(confidenceRegex);
    return match ? parseFloat(match[1]) : 0.5;
  }

  private async persistQueryAndResponse(
    organizationId: string,
    query: string,
    response: string
  ): Promise<void> {
    await prisma.aIInsightQuery.create({
      data: {
        organizationId,
        query,
        response,
      },
    });

    // Keep only the last 5 queries
    const queries = await prisma.aIInsightQuery.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: 6,
    });

    if (queries.length > 5) {
      await prisma.aIInsightQuery.delete({
        where: { id: queries[5].id },
      });
    }
  }

  async getRecentQueries(organizationId: string): Promise<RecentQuery[]> {
    const recentQueries = await prisma.aIInsightQuery.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { query: true, response: true, createdAt: true },
    });

    return recentQueries;
  }

  async getOrganizationInsights(
    organizationId: string
  ): Promise<OrganizationInsights> {
    const recentQueries = await this.getRecentQueries(organizationId);

    // Fetch insights using ClickHouse queries
    const [uniqueEventsResult, totalCountsResult, activeEntitiesResult] =
      await Promise.all([
        this.getUniqueEvents(organizationId),
        this.getTotalCounts(organizationId),
        this.getActiveEntities(organizationId),
      ]);

    const uniqueEvents = uniqueEventsResult.reduce(
      (acc, { name, count }) => {
        acc[name] = Number(count);
        return acc;
      },
      {} as { [eventName: string]: number }
    );

    const { totalEntities, totalEvents } = totalCountsResult[0];
    const averageEventsPerEntity = Number(
      (Number(totalEvents) / Number(totalEntities)).toFixed(2)
    );
    const activeEntitiesLast30Days = Number(
      activeEntitiesResult[0].active_entities
    );

    return {
      recentQueries,
      uniqueEvents,
      totalEntities: Number(totalEntities),
      totalEvents: Number(totalEvents),
      averageEventsPerEntity,
      activeEntitiesLast30Days,
    };
  }

  private async getUniqueEvents(
    organizationId: string
  ): Promise<UniqueEvent[]> {
    const query = `
      SELECT name, count(*) as count
      FROM events
      WHERE org_id = {organizationId:String}
      GROUP BY name
    `;
    const result = await this.clickhouse.query({
      query,
      query_params: { organizationId },
      format: "JSONEachRow",
    });
    return await result.json();
  }

  private async getTotalCounts(
    organizationId: string
  ): Promise<{ totalEntities: string; totalEvents: string }[]> {
    const query = `
      SELECT
        (SELECT count(*) FROM entities WHERE org_id = {organizationId:String}) as totalEntities,
        (SELECT count(*) FROM events WHERE org_id = {organizationId:String}) as totalEvents
    `;
    const result = await this.clickhouse.query({
      query,
      query_params: { organizationId },
      format: "JSONEachRow",
    });
    return await result.json();
  }

  private async getActiveEntities(
    organizationId: string
  ): Promise<{ active_entities: string }[]> {
    const query = `
      SELECT count(DISTINCT entity_id) as active_entities
      FROM events
      WHERE org_id = {organizationId:String}
        AND timestamp >= dateAdd(INTERVAL -30 DAY, now())
    `;
    const result = await this.clickhouse.query({
      query,
      query_params: { organizationId },
      format: "JSONEachRow",
    });
    return await result.json();
  }

  async generateSegmentFromNaturalLanguage(
    organizationId: string,
    input: string
  ): Promise<GeneratedSegment> {
    const entityProperties =
      await this.entityService.listUniqueProperties(organizationId);
    const eventNames =
      await this.eventService.getUniqueEventNames(organizationId);

    const context = this.prepareContextForSegmentGeneration(
      entityProperties,
      eventNames
    );

    const response = await this.anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      system: this.constructSystemPromptForSegmentGeneration(context),
      messages: [{ role: "user", content: input }],
    });

    return this.parseAIResponseForSegmentGeneration(response.content[0].text);
  }

  private prepareContextForSegmentGeneration(
    entityProperties: string[],
    eventNames: string[]
  ): string {
    return `
      Available entity properties:
      ${entityProperties.join(", ")}

      Available event names:
      ${eventNames.join(", ")}
    `;
  }

  private constructSystemPromptForSegmentGeneration(context: string): string {
    return `
      You are an AI assistant specializing in creating segments for a customer data platform.
      Your task is to generate a segment title, description, and conditions based on the user's natural language input.
      You have access to the following data:

      ${context}

      Please analyze the user's input and generate an appropriate segment.
      Respond with a JSON object containing the following fields:
      {
        "title": "A concise, descriptive title for the segment",
        "description": "A brief description of what this segment represents and why it's useful",
        "conditions": [
          {
            "criteria": [
              {
                "type": "property" or "event",
                "field": "property or event name",
                "operator": "one of the valid operators",
                "value": "the comparison value"
              }
            ],
            "logicalOperator": "and" or "or"
          }
        ]
      }

      Available SegmentCriterionType values:
      - "property": Use this for entity properties
      - "event": Use this for event-based conditions

      Available SegmentOperator values:
      - For properties:
        - "equals", "not_equals", "greater_than", "less_than", "contains", "not_contains", "in", "not_in", "between", "not_between"
      - For events:
        - "has_done", "has_not_done", "has_done_times", "has_done_first_time", "has_done_last_time", "has_done_within", "has_not_done_within"

      LogicalOperator values:
      - "and": All criteria must be true
      - "or": At least one criterion must be true

      Ensure that you only use properties and events that are available in the provided context.
      If the user requests a property or event that doesn't exist, mention it in your response and suggest alternatives.

      When using time-based operators (e.g., "has_done_within"), include a "timeUnit" field in the criterion with one of the following values: "seconds", "minutes", "hours", "days", "weeks", or "months".

      Example response:
      {
        "title": "High-Value Recent Customers",
        "description": "Customers who have made a purchase over $500 in the last 30 days. This segment is useful for targeting retention campaigns and upselling opportunities.",
        "conditions": [
          {
            "criteria": [
              {
                "type": "event",
                "field": "purchase",
                "operator": "has_done_within",
                "value": 30,
                "timeUnit": "days"
              },
              {
                "type": "property",
                "field": "last_purchase_amount",
                "operator": "greater_than",
                "value": 500
              }
            ],
            "logicalOperator": "and"
          }
        ]
      }

      Always validate that the properties and events you use in the conditions are available in the provided context.
      If you need to make assumptions or if there's ambiguity in the user's request, explain your reasoning in a comment before the JSON response.
    `;
  }

  private parseAIResponseForSegmentGeneration(
    aiResponse: string
  ): GeneratedSegment {
    try {
      // Extract the JSON part of the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in the AI response");
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);

      if (
        !parsedResponse.title ||
        !parsedResponse.description ||
        !Array.isArray(parsedResponse.conditions)
      ) {
        throw new Error("Invalid AI response format");
      }

      return {
        title: parsedResponse.title,
        description: parsedResponse.description,
        conditions: parsedResponse.conditions.map((condition: any) => ({
          ...condition,
          criteria: condition.criteria.map((criterion: any) => ({
            ...criterion,
            type: criterion.type as SegmentCriterionType,
            operator: criterion.operator as SegmentOperator,
          })),
          logicalOperator: condition.logicalOperator as LogicalOperator,
        })),
      };
    } catch (error) {
      console.error("Error parsing AI response:", error);
      throw new Error("Failed to parse AI response");
    }
  }
}
