import { ValidationError } from 'zod-validation-error';
// Dependencies
import { ZodError, z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { Result, Ok, Err, match } from 'oxide.ts';

// Event
import { Event } from './event.base';

// Exceptions
import { MutableExportException, ValidationException } from './exceptions';

// Types
import type {
  BaseStateSchema,
  CUID,
  CreateEntityProps,
  EntityMetadata,
  EntityObject,
  PropsFromSchema,
} from './types';

export class SubstantiatedEntity<
  const Schema extends BaseStateSchema = BaseStateSchema,
  const State extends z.infer<Schema>['state'] = z.infer<Schema>['state']
> {
  constructor({
    id,
    state,
    createdAt,
    updatedAt,
    props,
    schema,
  }: CreateEntityProps<Schema, State>) {
    const now = new Date();
    this._props = props;
    this._createdAt = createdAt || now;
    this._updatedAt = updatedAt || now;
    this._id = id;
    this._state = state;
    this._schema = schema;
    this._mutable = true;
  }

  protected readonly _id: CUID;
  protected readonly _props: PropsFromSchema<Schema, State>;
  private readonly _schema: Schema;
  private readonly _state: keyof Schema;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;
  private _events: Event[] = [];
  private _mutable: boolean;

  static create<
    const Schema extends BaseStateSchema = BaseStateSchema,
    const State extends z.infer<Schema>['state'] = z.infer<Schema>['state']
  >(
    props: CreateEntityProps<Schema, State>
  ): SubstantiatedEntity<Schema, State> {
    return new SubstantiatedEntity(props);
  }

  get events(): Event[] {
    return this._events;
  }

  protected addEvent(event: Event): void {
    this._events.push(event);
  }

  public clearEvents(): void {
    this._events = [];
  }

  get id(): CUID {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get state(): keyof Schema {
    return this._state;
  }

  get mutable(): boolean {
    return this._mutable;
  }

  public lock(): Result<this, ValidationException> {
    const validate = this.validate();

    if (validate.isOk()) {
      this._mutable = false;
      return Ok(this);
    } else {
      return Err(validate.unwrapErr());
    }
  }

  public unlock(): Ok<this> {
    this._mutable = true;
    return Ok(this);
  }

  private _internal_metadata(): EntityMetadata<typeof this._schema> {
    return {
      _id: this._id,
      _name: this.constructor.name,
      _state: this._state,
      _schema: this._schema,
      _events: this._events,
      _mutable: this._mutable,
    };
  }

  public toObject(): Result<
    EntityObject<typeof this._state, typeof this._props>,
    ValidationError | MutableExportException
  > {
    if (this._mutable) {
      return Err(new MutableExportException(this._internal_metadata()));
    }

    const validate = this.validate();

    return match(validate, {
      Ok: () => {
        return this.toObjectUnsafe();
      },
      Err: () => {
        throw validate.unwrapErr();
      },
    });
  }

  public toObjectUnsafe(): Ok<
    EntityObject<typeof this._state, typeof this._props>
  > {
    return Ok({
      id: this._id,
      state: this._state,
      ...this._props,
    });
  }

  public validate(): Result<this, ValidationException> {
    try {
      this._schema.parse(this.toObjectUnsafe().unwrap());
      return Ok(this);
    } catch (error) {
      const validationError = fromZodError(error as ZodError);
      return Err(
        new ValidationException(validationError, this._internal_metadata())
      );
    }
  }

  public validateUnsafe(): void {
    const validation = this.validate();

    if (validation.isErr()) {
      throw validation.unwrapErr();
    }
  }
}
