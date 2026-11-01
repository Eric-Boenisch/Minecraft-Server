"use client";

import { useState } from "react";
import styles from "../dashboard.module.css";

export default function YearSelector({ year2026, year2027, year2028 }) {
  const [selectedYear, setSelectedYear] = useState(null);

  const content = {
    2026: year2026,
    2027: year2027,
    2028: year2028,
  };

  return (
    <div className={styles.yearSelector}>
      <div className={styles.yearButtons} role="group" aria-label="Jahr auswählen">
        {[2026, 2027, 2028].map((year) => (
          <button
            className={styles.yearButton}
            key={year}
            type="button"
            aria-pressed={selectedYear === year}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </button>
        ))}
      </div>
      {selectedYear !== null && (
        <div className={styles.yearContent} aria-live="polite">
          {content[selectedYear]}
        </div>
      )}
    </div>
  );
}
