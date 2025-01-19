import { useState } from "react";
import { useNotification } from "@/utils/notifications";
import { getToken } from "@/utils/auth";
import { UtmParams } from "@/hooks/Utm";

export interface LinkParams {
  id: number;
  original_url: string;
  generated_url: string;
  shortcode: string;
  count: number;
  created_at: string;
  favicon_url: string;
  status: string;
  utm: UtmParams | null;
}

export const useLinks = () => {
  const { openNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [linkData, setLinkData] = useState<LinkParams[] | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(apiUrl + "/api/links", {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data: LinkParams[] = await response.json();
      const formattedData: LinkParams[] = data.map((link: LinkParams) => ({
        ...link,
        created_at: new Date(link.created_at.split(".")[0]).toLocaleString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          },
        ),
      }));
      setLinkData(formattedData);
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

  const createLink = async (
    originalUrl: string,
    utm_id: number | null,
    expires_at: string | null,
  ) => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(apiUrl + "/api/links", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          original_url: originalUrl,
          utm_id: utm_id,
          expires_at: expires_at,
        }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const newLink: LinkParams = await response.json();
      setLinkData((prevData) =>
        prevData ? [newLink, ...prevData] : [newLink],
      );
      return newLink;
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
  return { loading, linkData, fetchLinks, createLink, openNotification };
};
