import { z } from "zod";

export const AnalyticsSchema = z.object({
  total_clicks: z.number(),
  total_links: z.number(),
  average_clicks_per_active_link: z.number(),
  top_performing_links: z.array(
    z.object({
      link_id: z.number(),
      generated_url: z.string(),
      shortcode: z.string(),
      click_count: z.number(),
      original_url: z.string(),
      campaign: z.string(),
    }),
  ),
  referring_campaigns: z.array(
    z.object({
      campaign: z.string(),
      click_count: z.number(),
    }),
  ),
  referring_sites: z.array(
    z.object({
      domain: z.string(),
      click_count: z.number(),
    }),
  ),
  devices: z.array(
    z.object({
      device: z.string(),
      click_count: z.number(),
    }),
  ),
  browsers: z.array(
    z.object({
      browser: z.string(),
      click_count: z.number(),
    }),
  ),
  operating_systems: z.array(
    z.object({
      operating_system: z.string(),
      click_count: z.number(),
    }),
  ),
  geographical_data: z.object({
    geo_summary: z.array(
      z.object({
        continent: z.string(),
        country: z.string(),
        region: z.string(),
        city: z.string(),
        click_count: z.number(),
      }),
    ),
    continents: z.array(
      z.object({
        name: z.string(),
        click_count: z.number(),
      }),
    ),
    countries: z.array(
      z.object({
        name: z.string(),
        click_count: z.number(),
      }),
    ),
    regions: z.array(
      z.object({
        name: z.string(),
        click_count: z.number(),
      }),
    ),
    cities: z.array(
      z.object({
        name: z.string(),
        click_count: z.number(),
      }),
    ),
  }),
  monthly_click_trend: z.array(
    z.object({
      month: z.string(),
      click_count: z.number(),
    }),
  ),
});

export type AnalyticsType = z.infer<typeof AnalyticsSchema>;

export type TopPerformingLinksType =
  AnalyticsType["top_performing_links"][number];

export type GeographicalDataType = AnalyticsType["geographical_data"] | null;
