import { createNeonAuth } from "@neon/auth/next/server";
import { getNeonAuthConfig } from "./config";

const { baseUrl, cookieSecret } = getNeonAuthConfig();

export const auth = createNeonAuth({
  baseUrl,
  cookies: {
    secret: cookieSecret,
  },
});
