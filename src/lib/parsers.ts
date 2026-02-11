import * as XLSX from "xlsx";
import type {
  SupplierItem,
  ClientItem,
  ColumnMapping,
  ClientColumnMapping,
  UploadedFile,
} from "./types";

function normalize(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Parse a .txt file with structured lines like:
 * "Product Name - $99.99"
 * "Product Name $99"
 * "Product Name: $99.00"
 * "Product Name  99.99"
 */
export function parseTxt(text: string): SupplierItem[] {
  const lines = text.split("\n").filter((l) => l.trim());
  const items: SupplierItem[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Try various patterns:
    // "Name - $123.45" or "Name - 123.45"
    // "Name: $123.45"
    // "Name $123.45" (price at end)
    // "Name\t$123.45"
    const patterns = [
      /^(.+?)\s*[-:]\s*\$?\s*(\d+(?:\.\d{1,2})?)\s*$/,
      /^(.+?)\s+\$(\d+(?:\.\d{1,2})?)\s*$/,
      /^(.+?)\t+\$?\s*(\d+(?:\.\d{1,2})?)\s*$/,
    ];

    let matched = false;
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        const name = match[1].trim();
        const price = parseFloat(match[2]);
        if (name && !isNaN(price)) {
          items.push({
            name,
            normalizedName: normalize(name),
            price,
            rowIndex: i,
          });
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      // Last resort: try to find any number at the end
      const fallback = line.match(/^(.+?)\s+(\d+(?:\.\d{1,2})?)$/);
      if (fallback) {
        const name = fallback[1].trim();
        const price = parseFloat(fallback[2]);
        if (name && !isNaN(price) && price > 0) {
          items.push({
            name,
            normalizedName: normalize(name),
            price,
            rowIndex: i,
          });
        }
      }
    }
  }

  return items;
}

/**
 * Read an Excel file and return headers + preview rows + workbook
 */
export async function readExcelFile(file: File): Promise<UploadedFile> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });

  const headers = (jsonData[0] || []).map((h) => String(h || ""));
  const previewRows = jsonData.slice(1, 6).map((row) =>
    row.map((cell) => String(cell ?? ""))
  );

  return {
    file,
    type: "excel",
    headers,
    previewRows,
    workbook,
    sheetName,
  };
}

/**
 * Parse an Excel file using column mapping to extract supplier items
 */
export function parseExcelWithMapping(
  uploaded: UploadedFile,
  mapping: ColumnMapping
): SupplierItem[] {
  if (!uploaded.workbook || !uploaded.sheetName || !uploaded.headers) return [];

  const sheet = uploaded.workbook.Sheets[uploaded.sheetName];
  const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
  const items: SupplierItem[] = [];

  for (let i = 0; i < jsonData.length; i++) {
    const row = jsonData[i];
    const name = String(row[mapping.productName] ?? "").trim();
    const priceRaw = row[mapping.price];
    const price = typeof priceRaw === "number" ? priceRaw : parseFloat(String(priceRaw).replace(/[$,]/g, ""));

    if (name && !isNaN(price) && price > 0) {
      items.push({
        name,
        normalizedName: normalize(name),
        price,
        rowIndex: i + 1, // +1 because row 0 is headers in the sheet
      });
    }
  }

  return items;
}

/**
 * Parse client items needed from Excel/CSV
 */
export function parseClientItems(
  uploaded: UploadedFile,
  mapping: ClientColumnMapping
): ClientItem[] {
  if (!uploaded.workbook || !uploaded.sheetName) return [];

  const sheet = uploaded.workbook.Sheets[uploaded.sheetName];
  const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
  const items: ClientItem[] = [];

  for (const row of jsonData) {
    const name = String(row[mapping.productName] ?? "").trim();
    const qtyRaw = row[mapping.quantityNeeded];
    const qty = typeof qtyRaw === "number" ? qtyRaw : parseInt(String(qtyRaw), 10);

    if (name && !isNaN(qty) && qty > 0) {
      items.push({
        name,
        normalizedName: normalize(name),
        quantityNeeded: qty,
      });
    }
  }

  return items;
}
