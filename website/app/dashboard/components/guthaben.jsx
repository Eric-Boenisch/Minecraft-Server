"use server"
import { getCellValue, getColumnIndex } from "./excelService";
import RechargeDialog from "./RechargeDialog.jsx";
import styles from "../dashboard.module.css";

export default async function Guthaben( {rows, name} ) {

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

    if (EingezahltesGuthaben === 0) {
        var Output1 = "Du hast noch kein Guthaben eingezahlt. Du kannst es über die angegebenen Zahlungsmethoden aufladen.";
    }

    console.log("1: " + EingezahltesGuthaben);
    console.log("2: " + GuthabenNachGebür);
    console.log("3: " + AktuellesGuthaben);

    return(
        <div>
            <div className={styles.sectionHeading}>
                <h1>Guthaben</h1>
                <RechargeDialog />
            </div>
            <p>{Output1}</p>
            <p>{Output2}</p>
            <p>{Output3}</p>
        </div>
        
        
    )
}