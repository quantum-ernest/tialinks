"use client";
import React, { createContext, useContext, useState } from "react";
import { useNotification } from "@/utils/notifications";
import {
  isTokenValid,
  logout,
  removeToken,
  setToken,
  setUserObject,
} from "@/utils/auth";
import { useRouter } from "next/navigation";
import { getPendingUrl } from "@/utils/pendingUrl";
import { useLinks } from "@/hooks/Links";
import { AuthSchema } from "@/schemas/Auth";

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const useAuth = () => {
  const { openNotification } = useNotification();
  const { isAuthenticated, setIsAuthenticated } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<"email" | "otp">("email");
  const router = useRouter();
  const { createLink } = useLinks();
  const requestOTP = async (email: string) => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl + "/api/auth/otp/email/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      setStep("otp");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        openNotification("error", error.message, "saaaaa");
      } else {
        openNotification("error", "Unknown error occurred");
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const submitOTP = async (email: string, otp: string) => {
    const pendingUrl = getPendingUrl();
    try {
      setLoading(true);
      const response = await fetch(apiUrl + "/api/auth/otp/email/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email: email, otp: otp }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      const validation = AuthSchema.safeParse(data);
      if (!validation.success) {
        console.error(validation.error.errors);
        throw new Error("API response validation failed");
      }
      setToken(data.token);
      setUserObject(JSON.stringify(data.user));
      setIsAuthenticated(true);
      if (pendingUrl) {
        const newLink = await createLink(pendingUrl);
        if (newLink) {
          openNotification(
            "success",
            "Short link generated successfully.",
            newLink.generated_url,
          );
        }
      }
      router.push("/dashboard");
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
    step,
    setStep,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    submitOTP,
    requestOTP,
  };
};

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  checkAuth: () => void;
  logout: () => void;
};

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  checkAuth: () => {},
  setIsAuthenticated: () => {},
  logout: () => {},
};

export const AuthContext = createContext(defaultAuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(isTokenValid());

  const checkAuth = () => {
    const isValidToken = isTokenValid();

    if (isAuthenticated !== isValidToken) {
      setIsAuthenticated(isValidToken);
      if (!isValidToken) {
        removeToken();
      }
    }
    return isValidToken;
  };
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, checkAuth, setIsAuthenticated, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
