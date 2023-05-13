// Event
import { Event } from './event.base';

// Entity
import { Entity } from './entity.base';

// Types
import type { BaseStateSchema } from './types';

export abstract class EventModel<
  Schema extends BaseStateSchema
> extends Entity<Schema> {
  private _events: Event[] = [];

  get events(): Event[] {
    return this._events;
  }

  protected addEvent(event: Event): void {
    this._events.push(event);
  }

  public clearEvents(): void {
    this._events = [];
  }
}
