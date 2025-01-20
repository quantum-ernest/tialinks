import { z } from "zod";

export const AuthSchema = z.object({
  token: z.string(),
  user: z.object({
    name: z.string().nullable(),
    email: z.string(),
  }),
});
