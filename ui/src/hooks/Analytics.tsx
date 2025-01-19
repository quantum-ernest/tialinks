import { useState } from "react";
import { useNotification } from "@/utils/notifications";
import { AnalyticsSchema, AnalyticsType } from "@/schemas/Analytics";
import { getToken } from "@/utils/auth";
import dayjs from "dayjs";

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const useAnalytics = () => {
  const { openNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsType | null>(
    null,
  );
  const fetchAnalytics = async (
    start_date: string,
    end_date: string,
    link_id: number | null = null,
  ) => {
    try {
      setLoading(true);
      start_date = start_date || "2024-12-01T00:00:00";
      end_date =
        end_date ||
        dayjs(new Date().setFullYear(new Date().getFullYear() + 1)).format(
          "YYYY-MM-DDTHH:mm:ss",
        );
      const token = getToken();
      const response = await fetch(
        apiUrl +
          `/api/analytics?start_date=${start_date}&end_date=${end_date}${link_id ? `&link_id=${link_id}` : ""}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data: AnalyticsType = await response.json();
      const validation = AnalyticsSchema.safeParse(data);
      if (!validation.success) {
        console.error(validation.error.errors);
        throw new Error("API response validation failed");
      }
      setAnalyticsData(data);
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        openNotification("error", error.message);
      } else {
        openNotification("error", "Unknown error occurred");
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };
  return { fetchAnalytics, analyticsData, loading, openNotification };
};
