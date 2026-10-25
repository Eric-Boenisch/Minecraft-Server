import { getCellValue, readRows } from "./excelService";
import { getCurrentMonth, getCurrentYear } from "./ShowTable";

export async function whitelist() {
    const rows = await readRows();
    const month = (getCurrentYear() - 2026) * 12 + getCurrentMonth() -3 + 1; //gibt den Zeilenindex für den Monat aus der aktuell gewhitelisted wird.
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
    return(whitelist);
}

function API() {
    fetch('https://minecraft-server-gamma.vercel.app/', { //hier dann richtige URL einfügen und bei .htaccess den * mit der Server URL ersetzen
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(whitelist())
});
}





 