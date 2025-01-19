import { useState } from "react";
import { useNotification } from "../utils/notifications";
import { getToken } from "@/utils/auth";
import { UtmArraySchema, UtmSchema, UtmType } from "@/schemas/Utm";

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
export const useUtm = () => {
  const { openNotification } = useNotification();
  const [utmList, setUtmList] = useState<UtmType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchUtmList = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(apiUrl + "/api/utms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data: UtmType[] = await response.json();
      const validation = UtmArraySchema.safeParse(data);
      if (!validation.success) {
        console.error(validation.error.errors);
        throw new Error("API response validation failed");
      }
      setUtmList(data);
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

  const createUtm = async (utmParams: Omit<UtmType, "id">) => {
    try {
      const token = getToken();
      const response = await fetch(apiUrl + "/api/utms", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(utmParams),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const newUtm: UtmType = await response.json();
      const validation = UtmSchema.safeParse(newUtm);
      if (!validation.success) {
        console.error(validation.error.errors);
        throw new Error("API response validation failed");
      }
      setUtmList([newUtm, ...(utmList ?? [])]);
      openNotification("success", "UTM created successfully");
    } catch (error) {
      if (error instanceof Error) {
        openNotification("error", error.message);
      } else {
        openNotification("error", "Unknown error occurred");
        console.log(error);
      }
    }
  };

  const updateUtm = async (id: number, utmParams: Omit<UtmType, "id">) => {
    try {
      const token = getToken();
      const response = await fetch(apiUrl + `/api/utms/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(utmParams),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const updatedUtm: UtmType = await response.json();
      const validation = UtmSchema.safeParse(updatedUtm);
      if (!validation.success) {
        console.error(validation.error.errors);
        throw new Error("API response validation failed");
      }
      setUtmList(
        (utmList ?? []).map((utm) => (utm.id === id ? updatedUtm : utm)),
      );
    } catch (error) {
      if (error instanceof Error) {
        openNotification("error", error.message);
      } else {
        openNotification("error", "Unknown error occurred");
        console.log(error);
      }
    }
  };
  return { utmList, loading, fetchUtmList, createUtm, updateUtm };
};
