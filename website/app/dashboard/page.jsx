import { Suspense } from "react";
import { connection } from "next/server";
import { revalidatePath } from "next/cache";
import { getCellValue, readRows, updateCellValue } from "./components/excelService";
import {
  ShowTable2026,
  ShowTable2027,
  ShowTable2028,
} from "./components/ShowTable.jsx";
import YearSelector from "./components/YearSelector.jsx";
import { whitelist } from "./components/whitelist.js";

//bei Zellen immer so: Zeile Spalte
// Zeilen und Spalten werden im Index angegeben (Zeile 1 = Index 0 / Spalte 1 = Index 0)
async function updateSpreadsheet() {
  'use server';
  await updateCellValue(7, 1, true);
  revalidatePath("/dashboard");
}

export const name = "Edgar_";

async function DashboardContent() {
  await connection();
  const rows = await readRows();

  return (
    <>
      <p>{getCellValue(rows, 0, 1)}</p>
      <form action={updateSpreadsheet}>
        <button type="submit">Update Excel cell</button>
      </form>
      <YearSelector
        year2026={<ShowTable2026 rows={rows} name={name} />}
        year2027={<ShowTable2027 rows={rows} name={name} />}
        year2028={<ShowTable2028 rows={rows} name={name} />}
      />
    </>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<p>Loading dashboard...</p>}>
      <DashboardContent />
    </Suspense>
  );
}

console.log("test:" + whitelist());