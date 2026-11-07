import { randomUUID } from "node:crypto";
import { applyPaypalPayment } from "../../../dashboard/components/excelService.js";
import {
  getAuthenticatedUsername,
  getPurchaseUnitForUsername,
  PAYPAL_AMOUNT,
  PAYPAL_CURRENCY,
  paypalRequest,
} from "../paypal.js";

export async function POST(request) {
  try {
    const username = await getAuthenticatedUsername();
    if (!username) {
      return Response.json({ error: "Bitte melde dich erneut an." }, { status: 401 });
    }

    let orderId;
    try {
      ({ orderId } = await request.json());
    } catch {
      return Response.json({ error: "Ungültige Bestellnummer." }, { status: 400 });
    }

    if (
      typeof orderId !== "string" ||
      orderId.length > 100 ||
      !/^[A-Za-z0-9-]+$/.test(orderId)
    ) {
      return Response.json({ error: "Ungültige Bestellnummer." }, { status: 400 });
    }

    const encodedOrderId = encodeURIComponent(orderId);
    const order = await paypalRequest(`/v2/checkout/orders/${encodedOrderId}`);
    const purchaseUnit = getPurchaseUnitForUsername(order, username);
    const amount = purchaseUnit?.amount;

    if (
      order.intent !== "CAPTURE" ||
      order.status !== "APPROVED" ||
      amount?.currency_code !== PAYPAL_CURRENCY ||
      amount?.value !== PAYPAL_AMOUNT
    ) {
      return Response.json(
        { error: "Die Bestellung passt nicht zu deinem Konto oder dem festgelegten Betrag." },
        { status: 400 }
      );
    }

    const capture = await paypalRequest(
      `/v2/checkout/orders/${encodedOrderId}/capture`,
      {
        method: "POST",
        headers: { "PayPal-Request-Id": randomUUID() },
        body: {},
      }
    );

    const completedCapture =
      capture.purchase_units?.[0]?.payments?.captures?.find(
        (payment) => payment.status === "COMPLETED"
      );
    const status =
      completedCapture?.status ??
      capture.purchase_units?.[0]?.payments?.captures?.[0]?.status;
    if (status !== "COMPLETED" && status !== "PENDING") {
      return Response.json(
        { error: "PayPal hat die Zahlung nicht abgeschlossen." },
        { status: 400 }
      );
    }

    if (status === "COMPLETED") {
      if (
        !completedCapture?.id ||
        completedCapture.amount?.currency_code !== PAYPAL_CURRENCY ||
        completedCapture.amount?.value !== PAYPAL_AMOUNT
      ) {
        throw new Error("PayPal returned an invalid completed capture.");
      }

      await applyPaypalPayment(
        completedCapture.id,
        username,
        Number(PAYPAL_AMOUNT)
      );
    }

    return Response.json({ status });
  } catch (error) {
    console.error("PayPal capture failed:", error);
    return Response.json(
      { error: "Die PayPal-Zahlung konnte nicht bestätigt werden." },
      { status: 500 }
    );
  }
}
