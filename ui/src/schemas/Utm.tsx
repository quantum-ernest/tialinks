import { z } from "zod";

export const UtmSchema = z.object({
  id: z.number(),
  campaign: z.string(),
  source: z.string(),
  medium: z.string(),
  link_count: z.number().optional(),
});

export const UtmArraySchema = z.array(UtmSchema);

export type UtmType = z.infer<typeof UtmSchema>;
