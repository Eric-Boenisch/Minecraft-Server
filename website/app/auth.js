export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET is not configured. Set it in website/.env.local and restart the Next.js server."
    );
  }

  return secret;
}
