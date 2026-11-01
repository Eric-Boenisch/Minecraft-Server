import { getCurrentMonth, getCurrentYear } from "./ShowTable";
import { getCellValue, getColumnIndex, updateCellValue } from "./excelService";
import { whitelist } from "./whitelist";

export default function Teilgenommen({rows, name}) {
    
    function AktuelesDatum() {

        const Year = getCurrentYear();
        const month = getCurrentMonth();
        switch (month) {
            case 0: {var Month = "Januar"} break;
            case 1: {var Month = "Februar"} break;
            case 2: {var Month = "März"} break;
            case 3: {var Month = "April"} break;
            case 4: {var Month = "Mai"} break;
            case 5: {var Month = "Juni"} break;
            case 6: {var Month = "Juli"} break;
            case 7: {var Month = "August"} break;
            case 8: {var Month = "September"} break;
            case 9: {var Month = "Oktober"} break;
            case 10: {var Month = "November"} break;
            case 11: {var Month = "Dezember"} break;
        }
        const Datum = Month + ", " + Year;
        return(Datum);
        
    }

    async function TeilnehmenÜberprüfen() {
        "use server"
        const row = (getCurrentYear() - 2026) * 12 + getCurrentMonth() -3;

        if (getCellValue(rows, row, getColumnIndex(rows, name)) === true) {
            const alert = "Du nimmst an diesem Monat schon teil."
            return(alert)
        }

        const EingezahltesGuthaben = getCellValue(rows, 2, getColumnIndex(rows, name));
        const GuthabenNachGebür = EingezahltesGuthaben - EingezahltesGuthaben*0.2;
    
        let x = 0;
        for (let i = 7; i < 33; i++) {
            if (getCellValue(rows, i, getColumnIndex(rows, name)) === true ) {
                x = x + 1;
            } 
        }
        
        const Serverkosten = 0.5;
        const AktuellesGuthaben = GuthabenNachGebür - x * Serverkosten;

            if (AktuellesGuthaben < Serverkosten) {
                const alert = "Dein aktuelles Guthaben reicht nicht aus, um im nächsten Monat mitspielen zu können. Du kannst es über die angegebenen Zahlungsmethoden wieder aufladen.";
                return(alert);
            }
    
        updateCellValue(row, getColumnIndex(rows, name), true);
        whitelist();
        const alert = "Teilnahme erfolgreich";
        return(alert)    
    }
    
    return(
        <div>
            <h1>Monatliche Teilnahme</h1>
            <form action={TeilnehmenÜberprüfen}>
                <label htmlFor="teilnehmen">Möchtest du im {AktuelesDatum()} teilnehmen?</label>
                <p>{TeilnehmenÜberprüfen()}</p>
                <button type="submit">teilnehmen</button>
            </form>
        </div>
    )
}