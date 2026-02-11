import * as XLSX from "xlsx";

export interface SupplierItem {
  name: string;
  normalizedName: string;
  price: number;
  rowIndex: number; // row index in the original sheet (for writing back)
}

export interface ClientItem {
  name: string;
  normalizedName: string;
  quantityNeeded: number;
}

export interface ColumnMapping {
  productName: string; // column header name
  price: string;
  orderQuantity?: string; // column to write order qty into
}

export interface ClientColumnMapping {
  productName: string;
  quantityNeeded: string;
}

export interface ParsedSupplier {
  id: string;
  label: string;
  items: SupplierItem[];
  workbook?: XLSX.WorkBook; // keep original workbook for writing back
  sheetName?: string;
  columnMapping?: ColumnMapping;
}

export interface SupplierMatch {
  name: string;
  price: number;
  rowIndex: number;
}

export interface ReconciliationRow {
  clientItemName: string;
  quantityNeeded: number;
  supplier1Match?: SupplierMatch;
  supplier2Match?: SupplierMatch;
  supplier3Match?: SupplierMatch;
  bestPrice?: number;
  bestSupplier?: string; // "supplier1" | "supplier2" | "supplier3"
}

export type FileType = "txt" | "excel" | "csv";

export interface UploadedFile {
  file: File;
  type: FileType;
  data?: string | ArrayBuffer;
  headers?: string[];
  previewRows?: string[][];
  workbook?: XLSX.WorkBook;
  sheetName?: string;
}
