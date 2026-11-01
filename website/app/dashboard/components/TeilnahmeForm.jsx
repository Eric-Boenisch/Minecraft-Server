"use client";

import { useActionState } from "react";
import styles from "../dashboard.module.css";

export default function TeilnahmeForm({ action, apiAction, question }) {
  const [message, formAction, isPending] = useActionState(action, "");
  const [apiMessage, apiFormAction, isApiPending] = useActionState(apiAction, "");

  return (
    <div>
      <div className={styles.sectionHeading}>
        <h1>Monatliche Teilnahme</h1>
        <div className={styles.participationActions}>
          <form className={styles.participationForm} action={formAction}>
            <button type="submit" disabled={isPending}>
              {isPending ? "Wird verarbeitet..." : "Teilnehmen"}
            </button>
          </form>
          <form className={styles.participationForm} action={apiFormAction}>
            <button type="submit" disabled={isApiPending}>
              {isApiPending ? "Wird gesendet..." : "Whitelist senden"}
            </button>
          </form>
        </div>
      </div>
      <p>{question}</p>
      {message && (
        <p className={styles.participationMessage} role="status">
          {message}
        </p>
      )}
      {apiMessage && (
        <p className={styles.participationMessage} role="status">
          {apiMessage}
        </p>
      )}
    </div>
  );
}
