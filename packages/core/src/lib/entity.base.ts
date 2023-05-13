// Dependencies
import { ZodError, z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { Result, Ok, Err } from 'oxide.ts';

// Exceptions
import { ValidationException } from './exceptions';

// Types
import type {
  BaseStateSchema,
  CUID,
  CreateEntityProps,
  EntityMetadata,
  PropsFromSchema,
} from './types';

export abstract class Entity<
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
    this.props = props;
    this._createdAt = createdAt || now;
    this._updatedAt = updatedAt || now;
    this._id = id;
    this._state = state;
    this._schema = schema;

    this.validate().unwrap();
  }

  protected readonly _id: CUID;
  protected readonly props: PropsFromSchema<Schema, State>;
  private _schema: Schema;
  private _state: keyof Schema;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

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

  _internal_metadata(): EntityMetadata {
    return {
      _id: this._id,
      _name: this.constructor.name,
      _state: this._state,
    };
  }

  public validate(): Result<this, ValidationException> {
    try {
      this._schema.parse(this.props);
      return Ok(this);
    } catch (error) {
      const validationError = fromZodError(error as ZodError);
      return Err(
        new ValidationException(validationError, this._internal_metadata())
      );
    }
  }
}
