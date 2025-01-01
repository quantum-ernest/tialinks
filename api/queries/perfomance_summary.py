"""
Dashboard Summary Queries
"""

total_clicks = """
SELECT
    COUNT(*) AS total_clicks
FROM
    link_interaction
WHERE
    user_id = :user_id
"""


top_performing_links = """
SELECT link_id, shortcode, COUNT(*) AS click_count
FROM link_interaction
WHERE user_id = :user_id
GROUP BY link_id, shortcode
ORDER BY click_count DESC
LIMIT 10;
"""


total_clicks_per_day = """
SELECT
    date_trunc('day', created_at) AS day,
    EXTRACT(YEAR FROM created_at) AS year,
    COUNT(*) AS daily_clicks
FROM
    link_interaction
WHERE
    user_id = :user_id
GROUP BY
    day, year
ORDER BY
    year, day;
"""

link_age_performance = """
SELECT link_id, shortcode, MIN(created_at) AS link_created_at, COUNT(*) AS click_count
FROM link_interaction
WHERE user_id = :user_id
GROUP BY link_id, shortcode;
"""

total_clicks_per_link = """
SELECT link_id, shortcode, COUNT(*) AS link_clicks
FROM link_interaction
WHERE user_id = :user_id
GROUP BY link_id, shortcode;
"""


top_referring_campaign = """
SELECT
    campaign,
    COUNT(*) AS click_count
FROM
    link_interaction
WHERE
    user_id = :user_id
    AND campaign IS NOT NULL
GROUP BY
    campaign
ORDER BY
    click_count DESC
LIMIT 5;
"""


top_referring_site = """
SELECT
    domain,
    COUNT(*) AS click_count
FROM
    link_interaction
WHERE
    user_id = :user_id
    AND domain IS NOT NULL
GROUP BY
    domain
ORDER BY domain
LIMIT 5;
"""

top_device = """
SELECT
    device,
    COUNT(*) AS click_count
FROM
    link_interaction
WHERE
    user_id = :user_id
    AND device IS NOT NULL
GROUP BY
    device
ORDER BY
    click_count DESC
LIMIT 5;
"""

top_country = """
SELECT
    country,
    COUNT(*) AS click_count
FROM
    link_interaction
WHERE
    user_id = :user_id
    AND country IS NOT NULL
GROUP BY
    country
ORDER BY
    click_count DESC
LIMIT 5;
"""

monthly_click_trend = """
SELECT
    date_trunc('month', created_at) AS month,
    COUNT(*) AS monthly_clicks
FROM
    link_interaction
WHERE
    user_id = :user_id
GROUP BY
    month
ORDER BY
    month;
"""

month_most_clicks = """
SELECT
    date_trunc('month', created_at) AS month_most_clicks,
    COUNT(*) AS total_clicks
FROM
    link_interaction
WHERE
    user_id = :user_id
GROUP BY
    month_most_clicks
ORDER BY
    total_clicks DESC
LIMIT 1;
"""

# ------------------------------------

daily_click_trend = """
SELECT
    date_trunc('day', created_at) AS day,
    COUNT(*) AS daily_clicks
FROM
    link_interaction
WHERE
    user_id = :user_id
GROUP BY
    day
ORDER BY
    day;
"""

weekly_click_trend = """
SELECT
    date_trunc('week', created_at) AS week,
    COUNT(*) AS weekly_clicks
FROM
    link_interaction
WHERE
    user_id = :user_id
GROUP BY
    week
ORDER BY
    week;
"""


clicks_trend_by_day = """
SELECT
    DATE(created_at) AS date,
    shortcode,
    link_id,
    COUNT(*) AS clicks
FROM
    link_interaction
WHERE
    user_id = :user_id
GROUP BY
    DATE(created_at), shortcode, link_id
ORDER BY
    DATE(created_at) DESC;
"""


clicks_by_continent = """
SELECT
    continent,
    shortcode,
    link_id,
    COUNT(*) AS clicks
FROM
    link_interaction
WHERE
    user_id = :user_id
GROUP BY
    continent, shortcode,link_id
ORDER BY
    clicks DESC;
"""

clicks_by_country = """
SELECT
    country,
    shortcode,
    link_id,
    COUNT(*) AS clicks
FROM
    link_interaction
WHERE
    user_id = :user_id
GROUP BY
    country, shortcode, link_id
ORDER BY
    clicks DESC;
"""

clicks_by_region = """
SELECT
    region,
    shortcode,
    link_id,
    COUNT(*) AS clicks
FROM
    link_interaction
WHERE
    user_id = :user_id
GROUP BY
    region, shortcode, link_id
ORDER BY
    clicks DESC;
"""


clicks_by_city = """
SELECT
    city,
    shortcode,
    link_id,
    COUNT(*) AS clicks
FROM
    link_interaction
WHERE
    user_id = :user_id
GROUP BY
    city, shortcode, link_id
ORDER BY
    clicks DESC;
"""

clicks_by_country_city = """
SELECT
    country,
    city,
    shortcode,
    link_id,
    COUNT(*) AS clicks
FROM
    link_interaction
WHERE
    user_id = :user_id
GROUP BY
    country, city, shortcode,link_id
ORDER BY
    country, city;
"""


top_countries_for_shortcodes = """
SELECT
    country,
    shortcode,
    link_id,
    COUNT(*) AS clicks
FROM
    link_interaction
WHERE
    user_id = :user_id
GROUP BY
    country, shortcode,link_id
ORDER BY
    clicks DESC;
"""
