"use client";

import { useState } from "react";

export default function YearSelector({ year2026, year2027, year2028 }) {
  const [selectedYear, setSelectedYear] = useState(null);

  const content = {
    2026: year2026,
    2027: year2027,
    2028: year2028,
  };

  return (
    <>
      <div>
        {[2026, 2027, 2028].map((year) => (
          <button
            key={year}
            type="button"
            aria-pressed={selectedYear === year}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </button>
        ))}
      </div>
      {selectedYear !== null && <div>{content[selectedYear]}</div>}
    </>
  );
}
