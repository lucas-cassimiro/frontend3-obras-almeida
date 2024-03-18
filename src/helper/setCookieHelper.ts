import type { AppContext } from "next/app";
import { setCookie } from "nookies";

export default function setCookieHelper(
  context: AppContext["ctx"] | undefined,
  cookie_name: string,
  cookie_value: string
) {
  return setCookie?.(context, cookie_name, cookie_value, {
    maxAge: 60 * 60 * 168, // 1 week
    path: "/",
  });
}