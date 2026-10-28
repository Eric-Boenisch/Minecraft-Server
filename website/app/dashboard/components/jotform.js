import { NextResponse } from 'next/server';
import { getCellValue, getColumnIndex, updateCellValue, readRows } from './excelService';



export async function POST(request) {

    const rows = await readRows();

  try {
    // 1. Webhook-Daten empfangen
    const formData = await request.formData();
    
    let rawPayload = {};
    if (formData.has('rawRequest')) {
      // Jotform sendet die Daten oft als JSON-String im Feld 'rawRequest'
      rawPayload = JSON.parse(formData.get('rawRequest'));
    } else {
      // Fallback: Daten direkt aus dem FormData-Objekt auslesen
      for (const [key, value] of formData.entries()) {
        rawPayload[key] = value;
      }
    }

    // 2. Genau deinen Usernamen & Zahlungsstatus extrahieren
    // Da dein Eindeutiger Name 'username' ist, greifen wir direkt darauf zu:
    const username = rawPayload.username;

    // Zahlungsstatus ermitteln ('GOOD' oder 'COMPLETED' stehen für erfolgreiche Zahlungen)
    const paymentStatus = rawPayload.payment_status || rawPayload.status;
    const isPaid = paymentStatus === 'GOOD' || paymentStatus === 'COMPLETED';

    // 3. Überprüfen, ob die Zahlung erfolgreich war
    if (!isPaid) {
      console.log(`Zahlung noch nicht abgeschlossen oder fehlgeschlagen. Status: ${paymentStatus}`);
      return NextResponse.json({ message: 'Zahlung nicht abgeschlossen' }, { status: 200 });
    }

    if (isPaid) {
        const EingezahltesGuthaben = getCellValue(rows, 2, getColumnIndex(rows, username)) + 5;
        console.log(EingezahltesGuthaben);
        updateCellValue(2, getColumnIndex(rows, username), EingezahltesGuthaben);

    }

    if (!username) {
      console.error('Kein Username im Webhook empfangen!');
      return NextResponse.json({ error: 'Username fehlt' }, { status: 400 });
    }

    // 4. Datenbank-Update für deinen User ausführen
    // Beispiel (z. B. mit Prisma/Mongoose/Supabase):
    // await db.user.update({
    //   where: { username: username },
    //   data: { isPaid: true }
    // });

    console.log(`[Erfolg] Zahlung bestätigt für Username: ${username}`);

    // Antworte Jotform mit 200 OK
    return NextResponse.json({ success: true, username }, { status: 200 });

  } catch (error) {
    console.error('Fehler beim Verarbeiten des Jotform-Webhooks:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}