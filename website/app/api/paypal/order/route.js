import { randomUUID } from "node:crypto";
import { getColumnIndex, readRows } from "../../../dashboard/components/excelService.js";
import {
  getAuthenticatedUsername,
  PAYPAL_AMOUNT,
  PAYPAL_CURRENCY,
  paypalRequest,
} from "../paypal.js";

export async function POST() {
  try {
    const username = await getAuthenticatedUsername();
    if (!username) {
      return Response.json({ error: "Bitte melde dich erneut an." }, { status: 401 });
    }

    if (username.includes("|") || username.length > 122) {
      return Response.json(
        { error: "Der Minecraft-Name kann nicht für eine PayPal-Zahlung verwendet werden." },
        { status: 400 }
      );
    }

    const rows = await readRows();
    if (getColumnIndex(rows, username) < 0) {
      return Response.json(
        { error: "Dein Minecraft-Konto wurde in der Guthabenliste nicht gefunden." },
        { status: 400 }
      );
    }

    const order = await paypalRequest("/v2/checkout/orders", {
      method: "POST",
      headers: { "PayPal-Request-Id": randomUUID() },
      body: {
        intent: "CAPTURE",
        purchase_units: [
          {
            custom_id: `${username}|${PAYPAL_AMOUNT}`,
            description: "Minecraft Server-Guthaben",
            amount: { currency_code: PAYPAL_CURRENCY, value: PAYPAL_AMOUNT },
          },
        ],
      },
    });

    if (typeof order.id !== "string") {
      throw new Error("PayPal did not return an order ID.");
    }

    return Response.json({ id: order.id });
  } catch (error) {
    console.error("PayPal order creation failed:", error);
    return Response.json(
      { error: "Die PayPal-Bestellung konnte nicht erstellt werden." },
      { status: 500 }
    );
  }
}
