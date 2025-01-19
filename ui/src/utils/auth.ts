import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
}

export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};
export const setUserObject = (user: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userObject", user);
  }
};

export const getUserObject = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userObject");
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
};

export const logout = () => {
  removeToken();
};
export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp > currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};
