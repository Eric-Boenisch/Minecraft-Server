"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../dashboard.module.css";

let paypalSdkPromise;

function loadPaypalSdk(clientId) {
  if (window.paypal) return Promise.resolve(window.paypal);
  if (paypalSdkPromise) return paypalSdkPromise;

  paypalSdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const query = new URLSearchParams({
      "client-id": clientId,
      currency: "EUR",
      intent: "capture",
      components: "buttons",
    });

    script.src = `https://www.paypal.com/sdk/js?${query.toString()}`;
    script.async = true;
    script.onload = () => {
      if (window.paypal) {
        resolve(window.paypal);
      } else {
        reject(new Error("Das PayPal-SDK wurde nicht geladen."));
      }
    };
    script.onerror = () => reject(new Error("Das PayPal-SDK konnte nicht geladen werden."));
    document.head.appendChild(script);
  }).catch((error) => {
    paypalSdkPromise = undefined;
    throw error;
  });

  return paypalSdkPromise;
}

export default function RechargeDialog({ username }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPaypalButtons, setShowPaypalButtons] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const dialogRef = useRef(null);
  const buttonsRef = useRef(null);
  // TODO: Set NEXT_PUBLIC_PAYPAL_CLIENT_ID to the matching PayPal app's Client ID.
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !showPaypalButtons || !clientId || !buttonsRef.current) {
      return;
    }

    let cancelled = false;
    let paypalButtons;

    loadPaypalSdk(clientId)
      .then((paypal) => {
        if (cancelled) return undefined;

        paypalButtons = paypal.Buttons({
          style: { layout: "vertical", shape: "rect", label: "paypal" },
          createOrder: async () => {
            const response = await fetch("/api/paypal/order", { method: "POST" });
            const result = await response.json();

            if (!response.ok || typeof result.id !== "string") {
              throw new Error(result.error || "Die PayPal-Bestellung konnte nicht erstellt werden.");
            }

            return result.id;
          },
          onApprove: async (data) => {
            setErrorMessage("");
            const response = await fetch("/api/paypal/capture", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderID }),
            });
            const result = await response.json();

            if (!response.ok) {
              throw new Error(result.error || "Die Zahlung konnte nicht bestätigt werden.");
            }

            setPaymentMessage(
              result.status === "COMPLETED"
                ? "Zahlung abgeschlossen. Dein Guthaben wird nach der PayPal-Bestätigung aktualisiert."
                : "PayPal verarbeitet die Zahlung noch. Das Guthaben wird nach Abschluss aktualisiert."
            );
            setShowPaypalButtons(false);
          },
          onError: (error) => {
            console.error("PayPal checkout failed:", error);
            setErrorMessage(
              error instanceof Error
                ? error.message
                : "Bei der PayPal-Zahlung ist ein Fehler aufgetreten."
            );
          },
        });

        return paypalButtons.render(buttonsRef.current);
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("PayPal SDK setup failed:", error);
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Die PayPal-Zahlung konnte nicht vorbereitet werden."
          );
        }
      });

    return () => {
      cancelled = true;
      if (paypalButtons && typeof paypalButtons.close === "function") {
        paypalButtons.close().catch((error) => {
          console.error("Could not close PayPal buttons:", error);
        });
      }
    };
  }, [clientId, isOpen, showPaypalButtons]);

  function closeDialog() {
    setIsOpen(false);
    setShowPaypalButtons(false);
    setErrorMessage("");
    setPaymentMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setPaymentMessage("");

    if (!clientId) {
      setErrorMessage("PayPal ist noch nicht konfiguriert. Bitte NEXT_PUBLIC_PAYPAL_CLIENT_ID setzen.");
      return;
    }

    setShowPaypalButtons(true);
  }

  return (
    <>
      <div className={styles.actionForm}>
        <button
          className={styles.rechargeButton}
          type="button"
          onClick={() => setIsOpen(true)}
        >
          Guthaben aufladen
        </button>
      </div>
      <dialog
        ref={dialogRef}
        className={styles.rechargeDialog}
        aria-labelledby="recharge-dialog-title"
        onClose={closeDialog}
      >
        <h2 id="recharge-dialog-title">Guthaben aufladen</h2>
        <form className={styles.rechargeForm} onSubmit={handleSubmit}>
          <label>
            Minecraft Ingame-Name
            <input
              name="minecraftUsername"
              value={username}
              readOnly
              autoComplete="username"
            />
          </label>
          <label>
            Betrag
            <input name="amount" value="5,00 €" readOnly />
          </label>
          {!showPaypalButtons && !paymentMessage && (
            <button className={styles.rechargeButton} type="submit">
              Mit PayPal fortfahren
            </button>
          )}
        </form>
        {showPaypalButtons && (
          <div
            ref={buttonsRef}
            className={styles.paypalButtons}
            aria-label="PayPal-Zahlungsoptionen"
          />
        )}
        {errorMessage && (
          <p className={styles.rechargeError} role="alert">
            {errorMessage}
          </p>
        )}
        {paymentMessage && (
          <p className={styles.rechargeStatus} role="status">
            {paymentMessage}
          </p>
        )}
        <div className={styles.rechargeDialogActions}>
          <button
            className={styles.cancelRechargeButton}
            type="button"
            onClick={closeDialog}
          >
            Abbrechen
          </button>
        </div>
      </dialog>
    </>
  );
}
