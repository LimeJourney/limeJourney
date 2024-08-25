export interface EventData {
  id?: string;
  org_id: string;
  entity_id: string;
  name: string;
  properties: Record<string, any>;
  timestamp: string | Date;
}

export interface RecordEventRequest {
  entity_id: string;
  name: string;
  properties: Record<string, any>;
}
