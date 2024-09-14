import { Journey } from "@prisma/client";
import { EventService } from "./eventsService";
import { SegmentationService } from "./segmentationService";
// import {
//   Journey,
//   TriggerType,
//   EventTrigger,
//   SegmentTrigger,
//   TimeTrigger,
// } from "./types";

enum TriggerType {
  EVENT = "event",
  SEGMENT = "segment",
  TIME = "time",
}

interface BaseTrigger {
  type: TriggerType;
}

interface EventTrigger extends BaseTrigger {
  type: TriggerType.EVENT;
  eventName: string;
}

interface SegmentTrigger extends BaseTrigger {
  type: TriggerType.SEGMENT;
  segmentId: string;
  action: "joins" | "leaves";
}

interface TimeTrigger extends BaseTrigger {
  type: TriggerType.TIME;
  cronExpression: string;
}

type Trigger = EventTrigger | SegmentTrigger | TimeTrigger;

export class OrchestrationService {
  private eventService: EventService;
  private segmentationService: SegmentationService;

  constructor() // eventService: EventService,
  // segmentationService: SegmentationService
  {
    this.eventService = new EventService();
    this.segmentationService = new SegmentationService();
  }

  async registerTriggers(journey: Journey): Promise<void> {
    const triggers = this.extractTriggers(journey);
    for (const trigger of triggers) {
      switch (trigger.type) {
        case TriggerType.EVENT:
          await this.registerEventTrigger(journey.id, trigger);
          break;
        // case TriggerType.SEGMENT:
        //   await this.registerSegmentTrigger(journey.id, trigger);
        //   break;
        // case TriggerType.TIME:
        //   await this.registerTimeTrigger(journey.id, trigger);
        //   break;
        default:
          throw new Error(`Unsupported trigger type: ${(trigger as any).type}`);
      }
    }
  }

  private extractTriggers(journey: Journey): Trigger[] {
    const definition = JSON.parse(journey.definition as string);
    const triggers: Trigger[] = [];

    for (const node of definition.nodes) {
      if (node.type === "triggerNode") {
        switch (node.data.triggerType) {
          case "segment":
            triggers.push({
              type: TriggerType.SEGMENT,
              segmentId: node.data.segment,
              action: node.data.segmentAction,
            });
            break;
          case "event":
            triggers.push({
              type: TriggerType.EVENT,
              eventName: node.data.eventName,
            });
            break;
          //   case "time":
          //     triggers.push({
          //       type: TriggerType.TIME,
          //       cronExpression: node.data.cronExpression,
          //     });
          //     break;
          default:
            console.warn(`Unsupported trigger type: ${node.data.triggerType}`);
        }
      }
    }

    return triggers;
  }

  private async registerEventTrigger(
    journeyId: string,
    trigger: EventTrigger
  ): Promise<void> {
    await this.eventService.registerJourneyForEvent(
      journeyId,
      trigger.eventName
    );
  }

  //   private async registerSegmentTrigger(
  //     journeyId: string,
  //     trigger: SegmentTrigger
  //   ): Promise<void> {
  //     await this.segmentationService.registerJourneyForSegment(
  //       journeyId,
  //       trigger.segmentId,
  //       trigger.action
  //     );
  //   }
}
