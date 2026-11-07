"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../dashboard.module.css";

export default function RechargeDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

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
        onClose={() => setIsOpen(false)}
      >
        <h2 id="recharge-dialog-title">Guthaben aufladen</h2>
        <div className={styles.rechargeFormPlaceholder}>
          Das neue Aufladeformular wird hier eingebunden.
        </div>
        <div className={styles.rechargeDialogActions}>
          <button
            className={styles.cancelRechargeButton}
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Abbrechen
          </button>
        </div>
      </dialog>
    </>
  );
}
