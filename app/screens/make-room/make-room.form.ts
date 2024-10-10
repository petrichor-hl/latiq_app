import { z } from 'zod';

export const makeRoomSchema = z.object({
  topicId: z.string(),
  capacity: z.preprocess(val => Number(val), z.number().min(2).max(20)),
  round: z.preprocess(val => Number(val), z.number()),
  isPublic: z.boolean(),
});

export type MakeRoomForm = z.infer<typeof makeRoomSchema>;
