import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../../auth.js";

export const PAYPAL_AMOUNT = "5.00";
export const PAYPAL_CURRENCY = "EUR";

export function getPaypalApiBaseUrl() {
  // TODO: Set PAYPAL_API_BASE_URL to the Sandbox or Live API origin in website/.env.local.
  const baseUrl =
    process.env.PAYPAL_API_BASE_URL || "https://api-m.sandbox.paypal.com";
  const parsedUrl = new URL(baseUrl);

  if (parsedUrl.protocol !== "https:") {
    throw new Error("PAYPAL_API_BASE_URL must use HTTPS.");
  }

  return parsedUrl.origin;
}

export async function getAuthenticatedUsername() {
  const token = (await cookies()).get("auth_token");
  if (!token) return null;
  const jwtSecret = getJwtSecret();

  try {
    const user = jwt.verify(token.value, jwtSecret);
    return typeof user.Username === "string" && user.Username.length > 0
      ? user.Username
      : null;
  } catch {
    return null;
  }
}

export async function getPaypalAccessToken() {
  // TODO: Set these to the Client ID and Secret from the matching PayPal app.
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET must be configured."
    );
  }

  const response = await fetch(`${getPaypalApiBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  const result = await response.json();

  if (!response.ok || typeof result.access_token !== "string") {
    throw new Error(`PayPal OAuth request failed with status ${response.status}.`);
  }

  return result.access_token;
}

export async function paypalRequest(path, { method = "GET", body, headers = {} } = {}) {
  const accessToken = await getPaypalAccessToken();
  const response = await fetch(`${getPaypalApiBaseUrl()}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(`PayPal API request failed with status ${response.status}.`);
  }

  return result;
}

export function getPurchaseUnitForUsername(order, username) {
  const customId = `${username}|${PAYPAL_AMOUNT}`;
  return order.purchase_units?.find((unit) => unit.custom_id === customId);
}

export function parsePaymentCustomId(customId) {
  if (typeof customId !== "string") return null;

  const separatorIndex = customId.lastIndexOf("|");
  if (separatorIndex < 1) return null;

  const username = customId.slice(0, separatorIndex);
  const amount = customId.slice(separatorIndex + 1);

  if (
    username.length > 122 ||
    username.includes("|") ||
    amount !== PAYPAL_AMOUNT
  ) {
    return null;
  }

  return { username, amount };
}
