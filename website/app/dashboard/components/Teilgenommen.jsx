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
        const row = (getCurrentYear() - 2026) * 12 + getCurrentMonth() -3 + 1;

        if (getCellValue(rows, row, getColumnIndex(rows, name)) === true) {
            const alert = "du nimmst an diesem Monat schon teil"
            return(alert)
        }
    
        updateCellValue(row, getColumnIndex(rows, name), true);

        const alert = "Teilnahme erfolgreich"

        whitelist();
        return(alert)

        
    }
    
    return(
        <div>
            <h1>{AktuelesDatum()}</h1>
            <form action={TeilnehmenÜberprüfen}>
                <label htmlFor="teilnehmen">Möchtest du im aktuellen Monat mitspielen?</label>
                
                <button type="submit">teilnehmen</button>
            </form>
        </div>
    )
}