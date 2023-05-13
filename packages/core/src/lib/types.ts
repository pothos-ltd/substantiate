// Dependencies
import { z } from 'zod';

// Entity
import { SubstantiatedEntity } from './substantiated.entity';

// Event
import { Event } from './event.base';

export type BaseEntitySchema = {
  [key: string]: z.AnyZodObject;
};

export type BaseStateSchema = z.ZodDiscriminatedUnion<
  'state',
  z.ZodObject<any, any, any>[]
>;

export type EntityMetadata<
  S extends SubstantiatedEntity['_schema'] = SubstantiatedEntity['_schema']
> = {
  _id: CUID;
  _state: string | number | symbol;
  _name: string;
  _schema: S;
  _events: Event[];
  _mutable: boolean;
};

export type EntityObject<S, P> = {
  id: string;
  state: S;
} & P;

export type SchemaFromState<
  Schema extends BaseStateSchema,
  State extends z.infer<Schema>['state']
> = {
  [Key in z.infer<Schema>['state']]: Extract<z.infer<Schema>, { state: Key }>;
}[State];

export type PropsFromSchema<
  Schema extends BaseStateSchema,
  State extends z.infer<Schema>['state']
> = Omit<SchemaFromState<Schema, State>, 'state'>;

export type CUID = string;
export interface BaseEntityProps {
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEntityProps<
  Schema extends BaseStateSchema,
  State extends z.infer<Schema>['state']
> {
  id: CUID;
  state: State;
  props: PropsFromSchema<Schema, State>;
  schema: Schema;
  createdAt?: Date;
  updatedAt?: Date;
}
