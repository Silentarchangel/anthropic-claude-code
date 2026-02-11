import * as XLSX from "xlsx";
import type {
  ReconciliationRow,
  UploadedFile,
  ColumnMapping,
} from "./types";

/**
 * Fill in a supplier's Excel quotation form with order quantities
 * for items assigned to that supplier.
 */
export function fillSupplierForm(
  uploaded: UploadedFile,
  mapping: ColumnMapping,
  results: ReconciliationRow[],
  supplierKey: "supplier1" | "supplier2" | "supplier3"
): XLSX.WorkBook | null {
  if (!uploaded.workbook || !uploaded.sheetName || !mapping.orderQuantity) {
    return null;
  }

  // Clone the workbook by writing and reading
  const wbData = XLSX.write(uploaded.workbook, {
    type: "array",
    bookType: "xlsx",
  });
  const wb = XLSX.read(wbData, { type: "array" });
  const sheet = wb.Sheets[uploaded.sheetName];

  // Get all data with headers
  const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
  const headers = Object.keys(jsonData[0] || {});

  // Find the column index for orderQuantity
  const qtyColIdx = headers.indexOf(mapping.orderQuantity);
  if (qtyColIdx === -1) return null;

  // Get the column letter for writing
  const qtyColLetter = XLSX.utils.encode_col(qtyColIdx);

  // For each result assigned to this supplier, write the quantity
  for (const row of results) {
    if (row.bestSupplier !== supplierKey) continue;

    const matchKey = `${supplierKey}Match` as const;
    const match = row[matchKey];
    if (!match) continue;

    // rowIndex is 1-based (0 is header), so the cell row is rowIndex + 1 in XLSX (1-indexed, with row 1 being headers)
    const cellRef = `${qtyColLetter}${match.rowIndex + 1}`;
    sheet[cellRef] = { t: "n", v: row.quantityNeeded };
  }

  // Update the sheet range
  const range = XLSX.utils.decode_range(sheet["!ref"] || "A1");
  if (qtyColIdx > range.e.c) {
    range.e.c = qtyColIdx;
  }
  sheet["!ref"] = XLSX.utils.encode_range(range);

  return wb;
}

/**
 * Generate an order list for the TXT supplier (Supplier 1)
 * since there's no form to fill in.
 */
export function generateTxtSupplierOrder(
  results: ReconciliationRow[]
): XLSX.WorkBook {
  const orderRows = results
    .filter((r) => r.bestSupplier === "supplier1")
    .map((r) => ({
      "Item Name": r.clientItemName,
      "Matched Supplier Item": r.supplier1Match?.name || "",
      "Unit Price": r.supplier1Match?.price || 0,
      "Quantity to Order": r.quantityNeeded,
      Total: (r.supplier1Match?.price || 0) * r.quantityNeeded,
    }));

  const ws = XLSX.utils.json_to_sheet(orderRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Order");
  return wb;
}

/**
 * Generate the full reconciliation report as Excel
 */
export function generateReconciliationReport(
  results: ReconciliationRow[]
): XLSX.WorkBook {
  const reportRows = results.map((r) => ({
    "Client Item": r.clientItemName,
    "Qty Needed": r.quantityNeeded,
    "Supplier 1 (TXT)": r.supplier1Match?.price ?? "No match",
    "Supplier 2 (Excel)": r.supplier2Match?.price ?? "No match",
    "Supplier 3 (Excel)": r.supplier3Match?.price ?? "No match",
    "Best Price": r.bestPrice ?? "N/A",
    "Assigned To": r.bestSupplier
      ? r.bestSupplier.replace("supplier", "Supplier ")
      : "No match",
  }));

  const ws = XLSX.utils.json_to_sheet(reportRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Reconciliation");
  return wb;
}

/**
 * Download a workbook as an xlsx file
 */
export function downloadWorkbook(wb: XLSX.WorkBook, filename: string): void {
  const data = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  const blob = new Blob([data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
