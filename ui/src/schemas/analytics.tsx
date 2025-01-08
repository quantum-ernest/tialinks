import {z} from "zod"

const AnalyticsSchema = z.object({
  total_clicks: z.number(),
  total_links: z.number(),
  top_performing_links: z.array(z.object({
    link_id: z.number(),
    shortcode: z.string(),
    click_count: z.number(),
    original_url: z.string(),
    campaign: z.string(),
  })),
  referring_campaigns: z.array(z.object({
    campaign: z.string(),
    click_count: z.number(),
  })),
  referring_sites: z.array(z.object({
    domain: z.string(),
    click_count: z.number(),
  })),
  devices: z.array(z.object({
    device: z.string(),
    click_count: z.number(),
  })),
  browsers: z.array(z.object({
    browser: z.string(),
    click_count: z.number(),
  })),
  operating_systems: z.array(z.object({
    operating_system: z.string(),
    click_count: z.number(),
  })),
  geographical_data: z.object({
    geo_summary: z.array(z.object({
      continent: z.string(),
      country: z.string(),
      region: z.string(),
      city: z.string(),
      click_count: z.number(),
    })),
    continents: z.array(z.object({
      name: z.string(),
      click_count: z.number(),
    })),
    countries: z.array(z.object({
      name: z.string(),
      click_count: z.number(),
    })),
    regions: z.array(z.object({
      name: z.string(),
      click_count: z.number(),
    })),
    cities: z.array(z.object({
      name: z.string(),
      click_count: z.number(),
    })),
  }),
  monthly_click_trend: z.array(z.object({
    month: z.string(),
    click_count: z.number(),
  })),
});

export type AnalyticsType = z.infer<typeof AnalyticsSchema>


export { AnalyticsSchema };