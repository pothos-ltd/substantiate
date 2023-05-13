import { createId } from '@paralleldrive/cuid2';

type EventMetadata = {
  readonly timestamp: number;
  readonly sequence: number;
  readonly userId?: string;
};

export type EventProps<T> = T & {
  entityId: string;
  metadata: Omit<EventMetadata, 'timestamp'> & { timestamp?: number };
};

export abstract class Event<T extends Record<string, unknown> | never = never> {
  public readonly eventId: string;
  public readonly entityId: string;

  public readonly metadata: EventMetadata;

  constructor(props: EventProps<T>) {
    this.eventId = createId();
    this.entityId = props.entityId;
    this.metadata = {
      sequence: props.metadata.sequence,
      timestamp: props.metadata.timestamp || Date.now(),
      userId: props?.metadata?.userId,
    };
  }
}
