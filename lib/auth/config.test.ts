import { describe, expect, it } from "vitest";
import { getNeonAuthConfig } from "./config";

const validEnvironment = {
  NEON_AUTH_BASE_URL: "https://example.neonauth.example/auth",
  NEON_AUTH_COOKIE_SECRET: "a-secure-cookie-secret-that-is-long-enough",
};

describe("Neon Auth environment", () => {
  it("returns validated server configuration", () => {
    expect(getNeonAuthConfig(validEnvironment)).toEqual({
      baseUrl: validEnvironment.NEON_AUTH_BASE_URL,
      cookieSecret: validEnvironment.NEON_AUTH_COOKIE_SECRET,
    });
  });

  it("reports a missing Auth URL clearly", () => {
    expect(() =>
      getNeonAuthConfig({
        NEON_AUTH_COOKIE_SECRET: validEnvironment.NEON_AUTH_COOKIE_SECRET,
      }),
    ).toThrow("Missing NEON_AUTH_BASE_URL");
  });

  it("rejects an invalid Auth URL", () => {
    expect(() =>
      getNeonAuthConfig({
        ...validEnvironment,
        NEON_AUTH_BASE_URL: "not-a-url",
      }),
    ).toThrow("NEON_AUTH_BASE_URL must be a valid HTTP or HTTPS URL");
  });

  it("rejects a short cookie secret", () => {
    expect(() =>
      getNeonAuthConfig({
        ...validEnvironment,
        NEON_AUTH_COOKIE_SECRET: "too-short",
      }),
    ).toThrow("NEON_AUTH_COOKIE_SECRET must be at least 32 characters");
  });
});
