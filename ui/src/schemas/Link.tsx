import { z } from "zod";
import { UtmSchema } from "@/schemas/Utm";

export const LinkSchema = z.object({
  id: z.number(),
  original_url: z.string(),
  generated_url: z.string(),
  shortcode: z.string(),
  count: z.number(),
  created_at: z.string(),
  favicon_url: z.string(),
  status: z.string(),
  utm_id: z.number().nullable(),
  utm: UtmSchema.nullable(),
  expires_at: z.string().nullable(),
});

export const LinkArraySchema = z.array(LinkSchema);

export type LinkType = z.infer<typeof LinkSchema>;
