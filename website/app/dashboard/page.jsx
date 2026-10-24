import { Suspense } from "react";
import { connection } from "next/server";
import { revalidatePath } from "next/cache";
import { getCellValue, readRows, updateCellValue, getColumnIndex } from "./components/excelService";
import {
  ShowTable2026,
  ShowTable2027,
  ShowTable2028,
} from "./components/ShowTable.jsx";
import YearSelector from "./components/YearSelector.jsx";
import { whitelist } from "./components/whitelist.js";
import { LogoutAction } from "./components/logout.jsx";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../auth";

//bei Zellen immer so: Zeile Spalte
// Zeilen und Spalten werden im Index angegeben (Zeile 1 = Index 0 / Spalte 1 = Index 0)
async function updateSpreadsheet() {
  'use server';
  await updateCellValue(7, 1, true);
  revalidatePath("/dashboard");
}



async function DashboardContent() {
  await connection();

  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');

  const rows = await readRows();

  if (!token) {
    redirect('/login');
  }

  const jwtSecret = getJwtSecret();

  let name;
  try {
    const decodedUser = jwt.verify(token.value, jwtSecret);
    name = decodedUser.Username;
  } catch {
    redirect('/login');
  }

  return (
    <>
      <p>{getCellValue(rows, 0, getColumnIndex(rows, name))}</p>
      <form action={updateSpreadsheet}>
        <button type="submit">Update Excel cell</button>
      </form>
      <YearSelector
        year2026={<ShowTable2026 rows={rows} name={name} />}
        year2027={<ShowTable2027 rows={rows} name={name} />}
        year2028={<ShowTable2028 rows={rows} name={name} />}
      />

      <form action={LogoutAction}>
            <input name="hash"></input>
            <button type="submit">Logout</button>
        </form>
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