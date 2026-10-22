import ExcelJS from 'exceljs';
import path from 'node:path';

const filePath = path.join(
  process.cwd(),
  'app',
  'dashboard',
  'components',
  'Kostentabelle.xlsx'
);

async function readWorkbook() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  return workbook;
}

export async function readRows() {
  const worksheet = (await readWorkbook()).worksheets[0];
  return Array.from({ length: worksheet.rowCount }, (_, rowIndex) =>
    Array.from({ length: worksheet.columnCount }, (_, columnIndex) =>
      worksheet.getRow(rowIndex + 1).getCell(columnIndex + 1).value ?? null
    )
  );
}

export function getColumnIndex(rows, name) {
  return rows[0].findIndex((value) => value === name);
}

export function getRowIndex(rows, name) {
  return rows.findIndex((row) => row[0] === name);
}

export function getCellValue(rows, row, column) {
  return rows[row][column];
}

export async function updateCellValue(row, column, value) {
  const workbook = await readWorkbook();
  workbook.worksheets[0].getCell(row + 1, column + 1).value = value;
  await workbook.xlsx.writeFile(filePath);
}
