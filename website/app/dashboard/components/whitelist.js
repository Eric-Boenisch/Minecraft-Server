import { getCellValue, readRows } from "./excelService";
import { getCurrentMonth, getCurrentYear } from "./ShowTable";

export async function whitelist() {
    const rows = await readRows();
    const month = (getCurrentYear() - 2026) * 12 + getCurrentMonth() - 3; //gibt den Zeilenindex für den Monat aus der aktuell gewhitelisted wird.
    const whitelist = [];

    for (let i = 1; i < 21; i++) {
        if(getCellValue(rows, month , i) === true) {
            let CurrentUser = getCellValue(rows, 0, i);
            console.log("CurrentUser:" + CurrentUser);
            whitelist.push(CurrentUser);
        }
    }
    console.log(whitelist.length);
    var Whitelist = JSON.stringify(whitelist);
    return(Whitelist);
}

export async function API() {
    const body = await whitelist();
    const response = await fetch('https://minecraft-server-gamma.vercel.app/api/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
    });

    if (!response.ok) {
        throw new Error(`Whitelist-API antwortete mit Status ${response.status}`);
    }
}





 