import { getCellValue, getColumnIndex } from "./excelService";

export default function Guthaben( {rows, name} ) {

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

    if (EingezahltesGuthaben !== 0) {
        var Output1 = "Eingezahltes Guthaben: " + EingezahltesGuthaben + "€";
        var Output2 = "Guthaben nach Gebühr von 20%: " + GuthabenNachGebür + "€";
        var Output3 = "Aktuelles Guthaben: " + AktuellesGuthaben + "€";
    }

    console.log("1: " + EingezahltesGuthaben);
    console.log("2: " + GuthabenNachGebür);
    console.log("3: " + AktuellesGuthaben);

    function Liquide(AktuellesGuthaben, Serverkosten) {
        if (AktuellesGuthaben >= Serverkosten) {
            return("")
        }

        if (EingezahltesGuthaben === 0) {
            return("Du hast noch kein Guthaben eingezahlt. Du kannst es über die angegebenen Zahlungsmethoden aufladen.");
        }

        return("Dein aktuelles Guthaben reicht nicht aus, um im nächsten Monat mitspielen zu können. Du kannst es über die angegebenen Zahlungsmethoden wieder aufladen.")
    }
    
    return(
        <div>
            <h1>Guthaben</h1>
            <p>{Output1}</p>
            <p>{Output2}</p>
            <p>{Output3}</p>
            <p>{Liquide(AktuellesGuthaben, Serverkosten)}</p>
        </div>
        
        
    )
}