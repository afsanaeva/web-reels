import { jwtDecode } from "jwt-decode";

export const decodedToken = (token: string) => {
  if (token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  }
  return null;
};

export const tokenExpiresTime = (token: string) => {
  const decoded = decodedToken(token);
  if (decoded && decoded.exp) {
    const expiresTime = new Date(decoded.exp * 1000);

    return expiresTime;
  }
  console.error("Invalid decoded token:", decoded);
  return null;
};
