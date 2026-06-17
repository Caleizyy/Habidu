import { z } from 'zod';

export const createGroupSchema = z.object({ name: z.string().min(1) });
export const inviteMemberSchema = z.object({ sub: z.string().min(1) });
