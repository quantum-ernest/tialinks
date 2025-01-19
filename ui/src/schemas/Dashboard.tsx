import { z } from "zod";

export const DashboardSchema = z.object({
  total_links: z.number(),
  total_clicks: z.number(),
  average_clicks: z.number(),
  top_performing_links: z.array(
    z.object({
      link_id: z.number(),
      shortcode: z.string(),
      click_count: z.number(),
    }),
  ),
  top_referring_campaign: z.array(
    z.object({
      campaign: z.string(),
      click_count: z.number(),
    }),
  ),
  top_referring_site: z.array(
    z.object({
      domain: z.string(),
      click_count: z.number(),
    }),
  ),
  top_device: z.array(
    z.object({
      device: z.string(),
      click_count: z.number(),
    }),
  ),
  top_country: z.array(
    z.object({
      country: z.string(),
      click_count: z.number(),
    }),
  ),
  monthly_click_trend: z.array(
    z.object({
      month: z.string(),
      click_count: z.number(),
    }),
  ),
});

export type DashboardType = z.infer<typeof DashboardSchema>;
