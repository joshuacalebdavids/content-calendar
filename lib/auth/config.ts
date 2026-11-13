const MIN_COOKIE_SECRET_LENGTH = 32;

type NeonAuthEnvironment = Readonly<Record<string, string | undefined>>;

function requireValue(
  environment: NeonAuthEnvironment,
  key: "NEON_AUTH_BASE_URL" | "NEON_AUTH_COOKIE_SECRET",
) {
  const value = environment[key]?.trim();

  if (!value) {
    throw new Error(
      `Missing ${key}. Set it in .env.local and in the Vercel project environment.`,
    );
  }

  return value;
}

export function getNeonAuthConfig(
  environment: NeonAuthEnvironment = process.env,
) {
  const baseUrl = requireValue(environment, "NEON_AUTH_BASE_URL");
  const cookieSecret = requireValue(environment, "NEON_AUTH_COOKIE_SECRET");

  try {
    const parsedUrl = new URL(baseUrl);

    if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
      throw new Error("Unsupported protocol");
    }
  } catch {
    throw new Error("NEON_AUTH_BASE_URL must be a valid HTTP or HTTPS URL.");
  }

  if (cookieSecret.length < MIN_COOKIE_SECRET_LENGTH) {
    throw new Error(
      `NEON_AUTH_COOKIE_SECRET must be at least ${MIN_COOKIE_SECRET_LENGTH} characters.`,
    );
  }

  return { baseUrl, cookieSecret };
}
