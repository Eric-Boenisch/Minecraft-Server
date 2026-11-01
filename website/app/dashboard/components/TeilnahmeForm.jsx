"use client";

import { useActionState } from "react";
import styles from "../dashboard.module.css";

export default function TeilnahmeForm({ action, question }) {
  const [message, formAction, isPending] = useActionState(action, "");

  return (
    <div>
      <div className={styles.sectionHeading}>
        <h1>Monatliche Teilnahme</h1>
        <form className={styles.participationForm} action={formAction}>
          <button type="submit" disabled={isPending}>
            {isPending ? "Wird verarbeitet..." : "Teilnehmen"}
          </button>
        </form>
      </div>
      <p>{question}</p>
      {message && (
        <p className={styles.participationMessage} role="status">
          {message}
        </p>
      )}
    </div>
  );
}
