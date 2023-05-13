import { z } from 'zod';

export type BaseEntitySchema = {
  [key: string]: z.AnyZodObject;
};
