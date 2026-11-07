import ExcelJS from 'exceljs';
import { get, put } from '@vercel/blob';

const blobPathname = 'Kostentabelle.xlsx';
const excelContentType =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

async function readWorkbook() {
  const blob = await get(blobPathname, {
    access: 'private',
    useCache: false,
  });

  if (!blob) {
    throw new Error(
      `Vercel Blob "${blobPathname}" was not found. Upload the workbook to the connected Blob store first.`
    );
  }

  const fileBuffer = Buffer.from(
    await new Response(blob.stream).arrayBuffer()
  );
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(fileBuffer);

  return { workbook, etag: blob.blob.etag };
}

export async function readRows() {
  const { workbook } = await readWorkbook();
  const worksheet = workbook.worksheets[0];

  if (!worksheet) {
    throw new Error(`Vercel Blob "${blobPathname}" contains no worksheet.`);
  }

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
  const { workbook, etag } = await readWorkbook();
  const worksheet = workbook.worksheets[0];

  if (!worksheet) {
    throw new Error(`Vercel Blob "${blobPathname}" contains no worksheet.`);
  }

  worksheet.getCell(row + 1, column + 1).value = value;
  const fileBuffer = await workbook.xlsx.writeBuffer();

  await put(blobPathname, fileBuffer, {
    access: 'private',
    allowOverwrite: true,
    contentType: excelContentType,
    ifMatch: etag,
  });
}

export async function applyPaypalPayment(captureId, username, amount) {
  const { workbook, etag } = await readWorkbook();
  const worksheet = workbook.worksheets[0];

  if (!worksheet) {
    throw new Error(`Vercel Blob "${blobPathname}" contains no worksheet.`);
  }

  let paymentLedger = workbook.getWorksheet('PayPalPayments');
  const column = getColumnIndex(readRowsFromWorkbook(workbook), username);
  if (column < 0) {
    throw new Error(`No spreadsheet column found for username "${username}".`);
  }

  if (paymentLedger) {
    for (let rowNumber = 2; rowNumber <= paymentLedger.rowCount; rowNumber++) {
      if (paymentLedger.getCell(rowNumber, 1).value === captureId) {
        return { duplicate: true };
      }
    }
  } else {
    paymentLedger = workbook.addWorksheet('PayPalPayments');
    paymentLedger.addRow([
      'Capture ID',
      'Minecraft username',
      'Amount (EUR)',
      'Processed at (UTC)',
    ]);
  }

  const balanceCell = worksheet.getRow(3).getCell(column + 1);
  const currentBalance = Number(balanceCell.value ?? 0);
  if (!Number.isFinite(currentBalance) || !Number.isFinite(amount) || amount <= 0) {
    throw new Error(`Invalid balance or payment amount for username "${username}".`);
  }

  balanceCell.value = currentBalance + amount;
  paymentLedger.addRow([
    captureId,
    username,
    amount,
    new Date().toISOString(),
  ]);
  paymentLedger.state = 'veryHidden';

  const fileBuffer = await workbook.xlsx.writeBuffer();
  await put(blobPathname, fileBuffer, {
    access: 'private',
    allowOverwrite: true,
    contentType: excelContentType,
    ifMatch: etag,
  });

  return { duplicate: false };
}

function readRowsFromWorkbook(workbook) {
  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error(`Vercel Blob "${blobPathname}" contains no worksheet.`);
  }

  return Array.from({ length: worksheet.rowCount }, (_, rowIndex) =>
    Array.from({ length: worksheet.columnCount }, (_, columnIndex) =>
      worksheet.getRow(rowIndex + 1).getCell(columnIndex + 1).value ?? null
    )
  );
}
