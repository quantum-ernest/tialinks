import { getToken, setUserObject } from "@/utils/auth";
import { useNotification } from "@/utils/notifications";
import { useState } from "react";
import { UserSchema, UserType } from "@/schemas/User";

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
export const useUser = () => {
  const { openNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  const updateUser = async (name: Omit<UserType, "email">) => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(apiUrl + "/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const userData = await response.json();
      const validation = UserSchema.safeParse(userData);
      if (!validation.success) {
        console.error(validation.error.errors);
        throw new Error("API response validation failed");
      }
      setUserObject(JSON.stringify(userData));
      openNotification("success", "User name updated successfully.");
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
  return { loading, updateUser };
};
