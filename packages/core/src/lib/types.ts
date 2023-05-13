// Dependencies
import { z } from 'zod';

export type BaseStateSchema = z.ZodDiscriminatedUnion<
  'state',
  z.ZodObject<any, any, any>[]
>;

export type EntityMetadata = {
  _id: CUID;
  _state: string | number | symbol;
  _name: string;
};

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
