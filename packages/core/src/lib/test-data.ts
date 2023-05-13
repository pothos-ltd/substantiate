// Dependencies
import { z } from 'zod';

const TestEntityPendingSchema = z.object({
  state: z.literal('PENDING'),
  user_id: z.string().cuid2(),
});

const TestEntityActiveSchema = z.object({
  state: z.literal('ACTIVE'),
  onlyOnActiveState: z.string(),
});

export const TestEntitySchema = z.discriminatedUnion('state', [
  TestEntityPendingSchema,
  TestEntityActiveSchema,
]);
