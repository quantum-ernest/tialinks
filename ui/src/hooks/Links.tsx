import { useState } from "react";
import { useNotification } from "@/utils/notifications";
import { getToken } from "@/utils/auth";
import { LinkArraySchema, LinkSchema, LinkType } from "@/schemas/Link";

export const useLinks = () => {
  const { openNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [linkData, setLinkData] = useState<LinkType[] | null>(null);
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
      const data: LinkType[] = await response.json();
      const validation = LinkArraySchema.safeParse(data);
      if (!validation.success) {
        console.error(validation.error.errors);
        throw new Error("API response validation failed");
      }
      const formattedData: LinkType[] = data.map((link: LinkType) => ({
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
    utm_id: number | null = null,
    expires_at: string | null = null,
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
      const newLink: LinkType = await response.json();
      const validation = LinkSchema.safeParse(newLink);
      if (!validation.success) {
        console.error(validation.error.errors);
        throw new Error("API response validation failed");
      }
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

  const updateLink = async (
    id: number,
    utm_id: number | null,
    expires_at: string | null,
  ) => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(apiUrl + `/api/links/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          utm_id: utm_id,
          expires_at: expires_at,
        }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const updatedLink: LinkType = await response.json();
      const validation = LinkSchema.safeParse(updatedLink);
      if (!validation.success) {
        console.error(validation.error.errors);
        throw new Error("API response validation failed");
      }
      setLinkData(
        (linkData ?? []).map((link) => (link.id === id ? updatedLink : link)),
      );
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
  return {
    loading,
    linkData,
    fetchLinks,
    createLink,
    updateLink,
    openNotification,
  };
};
