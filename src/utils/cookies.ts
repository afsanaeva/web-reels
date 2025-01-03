import { authKey, refreshToken } from "@/constants/auth.constants";
import Cookies from "universal-cookie";
import { tokenExpiresTime } from "./jwt";

const cookies = new Cookies();

export const storeCookies = (cookieName: string, token: string) => {
  cookies.set(cookieName, token, {
    path: "/",
    expires: tokenExpiresTime(token) || undefined,
    // secure: true, // Add secure flag for production
    secure: process.env.NODE_ENV === "production",
    // domain:
    //   process.env.NODE_ENV === "production" ? ".niftycoders.net" : "localhost",
  });
};

export const getCookies = (name = authKey) => {
  return cookies.get(name);
};

export const removeCookies = (token: string) => {
  cookies.remove(authKey, { path: "/" });
  cookies.remove(refreshToken, { path: "/" });
};

export const userLogout = () => {
  cookies.remove(authKey, { path: "/" });
  cookies.remove(refreshToken, { path: "/" });
};
