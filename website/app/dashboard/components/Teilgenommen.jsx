import { getCurrentMonth, getCurrentYear } from "./ShowTable";
import { getCellValue, getColumnIndex, updateCellValue } from "./excelService";
import { whitelist } from "./whitelist";
import TeilnahmeForm from "./TeilnahmeForm.jsx";

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

    async function TeilnehmenÜberprüfen(_previousState, _formData) {
        "use server"
        const row = (getCurrentYear() - 2026) * 12 + getCurrentMonth() -3;

        if (getCellValue(rows, row, getColumnIndex(rows, name)) === true) {
            return "Du nimmst an diesem Monat schon teil.";
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
            return "Dein aktuelles Guthaben reicht nicht aus, um im nächsten Monat mitspielen zu können. Du kannst es über die angegebenen Zahlungsmethoden wieder aufladen.";
        }
    
        await updateCellValue(row, getColumnIndex(rows, name), true);
        await whitelist();
        return "Teilnahme erfolgreich.";
    }

    return(
        <div>
            <h1>Monatliche Teilnahme</h1>
            <p>Möchtest du im {AktuelesDatum()} teilnehmen?</p>
            <TeilnahmeForm action={TeilnehmenÜberprüfen} />
        </div>
    )
}