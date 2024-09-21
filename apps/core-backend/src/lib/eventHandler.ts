import { EventQueueService, EventType, Event } from "./queue";
import { SegmentationService } from "../services/segmentationService";
import {
  EntityCreatedEvent,
  EntityUpdatedEvent,
  EventOccurredEvent,
} from "./queue";
import { EventService } from "../services/eventsService";
import { TemporalService } from "./temporal";

/**
 * EventHandler class manages the processing of various event types in the system.
 * It coordinates between the EventQueueService, SegmentationService, and EventService.
 * This class is responsible for registering event handlers and processing different types of events.
 * It ensures that events are properly segmented and handled according to their type.
 */
export class EventHandler {
  private eventQueueService: EventQueueService;
  private segmentationService: SegmentationService;
  private eventService: EventService;

  /**
   * Initializes the EventHandler with necessary services.
   * Sets up instances of EventQueueService, SegmentationService, and EventService.
   * EventQueueService is initialized as a singleton to ensure consistent event handling across the application.
   * SegmentationService and EventService are created as new instances for this handler.
   */
  constructor() {
    this.eventQueueService = EventQueueService.getInstance();
    this.segmentationService = new SegmentationService();
    this.eventService = new EventService();
  }

  /**
   * Configures and registers event handlers for different event types.
   * Maps each event type (ENTITY_CREATED, ENTITY_UPDATED, EVENT_OCCURRED) to its corresponding handler method.
   * This method should be called after instantiating the EventHandler to set up the event processing pipeline.
   * Utilizes the EventQueueService to register these handlers, ensuring events are routed to the correct processor.
   */
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

    this.eventQueueService.registerEventHandler(
      EventType.TRIGGER_JOURNEY,
      this.handleJourneyTriggered
    );
  }

  /**
   * Handles ENTITY_CREATED events.
   * Verifies that the event type matches ENTITY_CREATED before processing.
   * Utilizes the SegmentationService to segment the event, which may involve categorizing or tagging the new entity.
   * This method is asynchronous to allow for potential database operations or external service calls.
   * @param event The Event object representing the entity creation event.
   */
  private handleEntityCreated = async (event: Event): Promise<void> => {
    if (event.type === EventType.ENTITY_CREATED) {
      await this.segmentationService.segmentEvent(event);
    }
  };

  /**
   * Handles ENTITY_UPDATED events.
   * Checks if the event type is ENTITY_UPDATED before proceeding with processing.
   * Uses the SegmentationService to re-segment the event, which may involve updating categories or tags based on the entity changes.
   * Operates asynchronously to accommodate potential time-consuming operations.
   * @param event The Event object representing the entity update event.
   */
  private handleEntityUpdated = async (event: Event): Promise<void> => {
    if (event.type === EventType.ENTITY_UPDATED) {
      await this.segmentationService.segmentEvent(event);
    }
  };

  /**
   * Handles EVENT_OCCURRED events.
   * Verifies the event type is EVENT_OCCURRED before processing.
   * Performs two actions: segmenting the event and handling it for journey registration.
   * Segmentation is done via SegmentationService, potentially categorizing the event for analytics or targeting.
   * Journey registration is handled by EventService, possibly updating user journeys or triggering follow-up actions.
   * @param event The Event object representing the occurred event.
   */
  private handleEventOccurred = async (event: Event): Promise<void> => {
    if (event.type === EventType.EVENT_OCCURRED) {
      await this.segmentationService.segmentEvent(event);
      await this.eventService.handleEventForJourneyRegistration(event);
    }
  };

  /**
   * Handles TRIGGER_JOURNEY events.
   * Verifies that the event type matches TRIGGER_JOURNEY before processing.
   * Utilizes the EventService to trigger the journey associated with the event.
   * This method is asynchronous to allow for potential database operations or external service calls.
   * @param event The Event object representing the journey trigger event.
   */
  private handleJourneyTriggered = async (event: Event): Promise<void> => {
    if (event.type === EventType.TRIGGER_JOURNEY) {
      //   await this.eventService.triggerJourney(event);
      console.log(
        "\x1b[1m%s\x1b[0m",
        `Journey Triggered: ${JSON.stringify(event, null, 2)}`
      );

      try {
        const temporalService = await TemporalService.getInstance();

        await temporalService.startJourneyWorkflow({
          journeyId: event.journeyId,
          entityId: event.entityId,
          organizationId: event.organizationId,
          triggerEvent: {
            eventName: event.eventName,
            eventProperties: event.eventProperties,
          },
        });

        console.log(
          `Started journey workflow for journey ${event.journeyId} and entity ${event.entityId}`
        );
      } catch (error) {
        console.error(`Error starting journey workflow: ${error}`);
        // Handle the error appropriately
      }
    }
  };

  /**
   * Validates if an event is one of the entity-related event types.
   * Checks if the event type is ENTITY_CREATED, ENTITY_UPDATED, or EVENT_OCCURRED.
   * This method serves as a type guard, narrowing the event type for TypeScript type checking.
   * Useful for ensuring type safety when working with different event types in the system.
   * @param event The Event object to be validated.
   * @returns A boolean indicating whether the event is a valid entity event, and narrows the type if true.
   */
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
