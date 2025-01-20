import { useState } from "react";
import { useNotification } from "@/utils/notifications";
import { getToken } from "@/utils/auth";
import { DashboardSchema, DashboardType } from "@/schemas/Dashboard";

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const useDashboard = () => {
  const { openNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardType | null>(
    null,
  );
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(apiUrl + "/analytics/dashboard", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data: DashboardType = await response.json();
      const validation = DashboardSchema.safeParse(data);
      if (!validation.success) {
        console.error(validation.error.errors);
        throw new Error("API response validation failed");
      }
      setDashboardData(data);
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
  return { loading, fetchDashboardData, dashboardData };
};
