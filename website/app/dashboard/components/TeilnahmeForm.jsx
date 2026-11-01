"use client";

import { useActionState } from "react";
import styles from "../dashboard.module.css";

export default function TeilnahmeForm({ action }) {
  const [message, formAction, isPending] = useActionState(action, "");

  return (
    <form action={formAction}>
      {message && (
        <p className={styles.participationMessage} role="status">
          {message}
        </p>
      )}
      <button type="submit" disabled={isPending}>
        {isPending ? "Wird verarbeitet..." : "Teilnehmen"}
      </button>
    </form>
  );
}
