import { getCellValue, getColumnIndex } from "./excelService";

function Teilgenommen(rows, row, name) {
    let teilgenommen = getCellValue(rows, row, getColumnIndex(rows, name));
    if (teilgenommen === true) {
        return("ja");
    }
    else {
        return("nein");
    }
}

export function getCurrentMonth() {
  const d = new Date();
  return d.getMonth(); // 0 - 11 später ab 1-12
}

export function getCurrentYear() {
  return new Date().getFullYear();
}


function Status(getCurrentYear, Year, getCurrentMonth, Month) {
    if (getCurrentYear() > Year) {
        return("abgelaufen");
    }    
    
    if (getCurrentYear() === Year) {
        if (getCurrentMonth() + 1 > Month) {
            return("abgelaufen");
        }

        if (getCurrentMonth() + 1 === Month) {
            return("aktiv");
        }

        if (getCurrentMonth() + 1 < Month) {
            return("noch nicht aktiv");
        }
    }

    if (getCurrentYear() < Year) {
        return("noch nicht aktiv");
    } 
}


export function ShowTable2026({ rows, name }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Monat</th>
          <th>Teilgenommen</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>November</th>
          <th>{Teilgenommen(rows, 7, name)}</th>
          <th>{Status(getCurrentYear, 2026, getCurrentMonth, 11)}</th>
        </tr>
        <tr>
          <th>Dezember</th>
          <th>{Teilgenommen(rows, 8, name)}</th>
          <th>{Status(getCurrentYear, 2026, getCurrentMonth, 12)}</th>
        </tr>
      </tbody>
    </table>
  );
}

export function ShowTable2027({ rows, name }) {

  return (
    <table>
      <thead>
        <tr>
          <th>Monat</th>
          <th>Teilgenommen</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Januar</th>
          <th>{Teilgenommen(rows, 9, name)}</th>
          <th>{Status(getCurrentYear, 2027, getCurrentMonth, 1)}</th>
        </tr>
        <tr>
          <th>Februar</th>
          <th>{Teilgenommen(rows, 10, name)}</th>
          <th>{Status(getCurrentYear, 2027, getCurrentMonth, 2)}</th>
        </tr>
        <tr>
          <th>März</th>
          <th>{Teilgenommen(rows, 11, name)}</th>
          <th>{Status(getCurrentYear, 2027, getCurrentMonth, 3)}</th>
        </tr>
        <tr>
          <th>April</th>
          <th>{Teilgenommen(rows, 12, name)}</th>
          <th>{Status(getCurrentYear, 2027, getCurrentMonth, 4)}</th>
        </tr>
        <tr>
          <th>Mai</th>
          <th>{Teilgenommen(rows, 13, name)}</th>
          <th>{Status(getCurrentYear, 2027, getCurrentMonth, 5)}</th>
        </tr>
        <tr>
          <th>Juni</th>
          <th>{Teilgenommen(rows, 14, name)}</th>
          <th>{Status(getCurrentYear, 2027, getCurrentMonth, 6)}</th>
        </tr>
        <tr>
          <th>Juli</th>
          <th>{Teilgenommen(rows, 15, name)}</th>
          <th>{Status(getCurrentYear, 2027, getCurrentMonth, 7)}</th>
        </tr>
        <tr>
          <th>August</th>
          <th>{Teilgenommen(rows, 16, name)}</th>
          <th>{Status(getCurrentYear, 2027, getCurrentMonth, 8)}</th>
        </tr>
        <tr>
          <th>September</th>
          <th>{Teilgenommen(rows, 17, name)}</th>
          <th>{Status(getCurrentYear, 2027, getCurrentMonth, 9)}</th>
        </tr>
        <tr>
          <th>Oktober</th>
          <th>{Teilgenommen(rows, 18, name)}</th>
          <th>{Status(getCurrentYear, 2027, getCurrentMonth, 10)}</th>
        </tr>
        <tr>
          <th>November</th>
          <th>{Teilgenommen(rows, 19, name)}</th>
          <th>{Status(getCurrentYear, 2027, getCurrentMonth, 11)}</th>
        </tr>
        <tr>
          <th>Dezember</th>
          <th>{Teilgenommen(rows, 20, name)}</th>
          <th>{Status(getCurrentYear, 2027, getCurrentMonth, 12)}</th>
        </tr>
      </tbody>
    </table>
  );
}

export function ShowTable2028({ rows, name }) {

  return (
    <table>
      <thead>
        <tr>
          <th>Monat</th>
          <th>Teilgenommen</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Januar</th>
          <th>{Teilgenommen(rows, 21, name)}</th>
          <th>{Status(getCurrentYear, 2028, getCurrentMonth, 1)}</th>
        </tr>
        <tr>
          <th>Februar</th>
          <th>{Teilgenommen(rows, 22, name)}</th>
          <th>{Status(getCurrentYear, 2028, getCurrentMonth, 2)}</th>
        </tr>
        <tr>
          <th>März</th>
          <th>{Teilgenommen(rows, 23, name)}</th>
          <th>{Status(getCurrentYear, 2028, getCurrentMonth, 3)}</th>
        </tr>
        <tr>
          <th>April</th>
          <th>{Teilgenommen(rows, 24, name)}</th>
          <th>{Status(getCurrentYear, 2028, getCurrentMonth, 4)}</th>
        </tr>
        <tr>
          <th>Mai</th>
          <th>{Teilgenommen(rows, 25, name)}</th>
          <th>{Status(getCurrentYear, 2028, getCurrentMonth, 5)}</th>
        </tr>
        <tr>
          <th>Juni</th>
          <th>{Teilgenommen(rows, 26, name)}</th>
          <th>{Status(getCurrentYear, 2028, getCurrentMonth, 6)}</th>
        </tr>
        <tr>
          <th>Juli</th>
          <th>{Teilgenommen(rows, 27, name)}</th>
          <th>{Status(getCurrentYear, 2028, getCurrentMonth, 7)}</th>
        </tr>
        <tr>
          <th>August</th>
          <th>{Teilgenommen(rows, 28, name)}</th>
          <th>{Status(getCurrentYear, 2028, getCurrentMonth, 8)}</th>
        </tr>
        <tr>
          <th>September</th>
          <th>{Teilgenommen(rows, 29, name)}</th>
          <th>{Status(getCurrentYear, 2028, getCurrentMonth, 9)}</th>
        </tr>
        <tr>
          <th>Oktober</th>
          <th>{Teilgenommen(rows, 30, name)}</th>
          <th>{Status(getCurrentYear, 2028, getCurrentMonth, 10)}</th>
        </tr>
        <tr>
          <th>November</th>
          <th>{Teilgenommen(rows, 31, name)}</th>
          <th>{Status(getCurrentYear, 2028, getCurrentMonth, 11)}</th>
        </tr>
        <tr>
          <th>Dezember</th>
          <th>{Teilgenommen(rows, 32, name)}</th>
          <th>{Status(getCurrentYear, 2028, getCurrentMonth, 12)}</th>
        </tr>
      </tbody>
    </table>
  );
}