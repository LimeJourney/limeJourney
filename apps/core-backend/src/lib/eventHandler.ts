import { EventQueueService, EventType, Event } from "./queue";
import { SegmentationService } from "../services/segmentationService";
import {
  EntityCreatedEvent,
  EntityUpdatedEvent,
  EventOccurredEvent,
} from "./queue";

export class EventHandler {
  private eventQueueService: EventQueueService;
  private segmentationService: SegmentationService;

  constructor() {
    this.eventQueueService = EventQueueService.getInstance();
    this.segmentationService = new SegmentationService();
  }

  public configureEventHandlers(): void {
    this.eventQueueService.registerEventHandler(
      EventType.ENTITY_CREATED,
      this.handleEntityCreated
    );
    this.eventQueueService.registerEventHandler(
      EventType.ENTITY_UPDATED,
      this.handleEntityUpdated
    );
    this.eventQueueService.registerEventHandler(
      EventType.EVENT_OCCURRED,
      this.handleEventOccurred
    );
  }

  private handleEntityCreated = async (event: Event): Promise<void> => {
    if (event.type === EventType.ENTITY_CREATED) {
      await this.segmentationService.segmentEvent(event);
    }
  };

  private handleEntityUpdated = async (event: Event): Promise<void> => {
    if (event.type === EventType.ENTITY_UPDATED) {
      await this.segmentationService.segmentEvent(event);
    }
  };

  private handleEventOccurred = async (event: Event): Promise<void> => {
    if (event.type === EventType.EVENT_OCCURRED) {
      await this.segmentationService.segmentEvent(event);
    }
  };

  private isValidEntityEvent(
    event: Event
  ): event is EntityCreatedEvent | EntityUpdatedEvent | EventOccurredEvent {
    return [
      EventType.ENTITY_CREATED,
      EventType.ENTITY_UPDATED,
      EventType.EVENT_OCCURRED,
    ].includes(event.type);
  }
}
