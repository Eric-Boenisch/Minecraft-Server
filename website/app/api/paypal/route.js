import { applyPaypalPayment } from "../../dashboard/components/excelService.js";
import {
  getPaypalAccessToken,
  getPaypalApiBaseUrl,
  parsePaymentCustomId,
  paypalRequest,
  PAYPAL_AMOUNT,
  PAYPAL_CURRENCY,
} from "./paypal.js";

async function verifyWebhookSignature(request, event) {
  // TODO: Set PAYPAL_WEBHOOK_ID to the ID of this app's matching Sandbox or Live webhook.
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    throw new Error("PAYPAL_WEBHOOK_ID is not configured.");
  }

  const headers = {
    auth_algo: request.headers.get("paypal-auth-algo"),
    cert_url: request.headers.get("paypal-cert-url"),
    transmission_id: request.headers.get("paypal-transmission-id"),
    transmission_sig: request.headers.get("paypal-transmission-sig"),
    transmission_time: request.headers.get("paypal-transmission-time"),
  };

  if (Object.values(headers).some((value) => !value)) {
    return false;
  }

  const accessToken = await getPaypalAccessToken();
  const response = await fetch(
    `${getPaypalApiBaseUrl()}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...headers,
        webhook_id: webhookId,
        webhook_event: event,
      }),
      cache: "no-store",
    }
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `PayPal webhook verification failed with status ${response.status}.`
    );
  }

  return result.verification_status === "SUCCESS";
}

async function getCaptureCustomId(capture, captureId) {
  if (typeof capture.custom_id === "string") {
    return capture.custom_id;
  }

  const orderId = capture.supplementary_data?.related_ids?.order_id;
  if (!orderId) return null;

  const order = await paypalRequest(
    `/v2/checkout/orders/${encodeURIComponent(orderId)}`
  );
  const purchaseUnit = order.purchase_units?.find((unit) =>
    unit.payments?.captures?.some((payment) => payment.id === captureId)
  );

  return purchaseUnit?.custom_id ?? null;
}

export async function POST(request) {
  let event;
  try {
    event = await request.json();
  } catch {
    return Response.json({ error: "Ungültiger Webhook-Inhalt." }, { status: 400 });
  }

  try {
    if (!(await verifyWebhookSignature(request, event))) {
      return Response.json({ error: "Ungültige PayPal-Signatur." }, { status: 400 });
    }

    if (event.event_type !== "PAYMENT.CAPTURE.COMPLETED") {
      return Response.json({ received: true, ignored: true });
    }

    const captureId = event.resource?.id;
    if (
      typeof captureId !== "string" ||
      event.resource?.status !== "COMPLETED"
    ) {
      return Response.json({ error: "Ungültige PayPal-Zahlungsdaten." }, { status: 400 });
    }

    const capture = await paypalRequest(
      `/v2/payments/captures/${encodeURIComponent(captureId)}`
    );
    const customId = await getCaptureCustomId(capture, captureId);
    const payment = parsePaymentCustomId(customId);
    const amount = capture.amount;

    if (
      capture.id !== captureId ||
      capture.status !== "COMPLETED" ||
      !payment ||
      amount?.currency_code !== PAYPAL_CURRENCY ||
      amount?.value !== PAYPAL_AMOUNT
    ) {
      return Response.json(
        { error: "Die bestätigte Zahlung stimmt nicht mit der erwarteten Zahlung überein." },
        { status: 400 }
      );
    }

    await applyPaypalPayment(captureId, payment.username, Number(payment.amount));

    return Response.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook processing failed:", error);
    return Response.json(
      { error: "Der PayPal-Webhook konnte nicht verarbeitet werden." },
      { status: 500 }
    );
  }
}
