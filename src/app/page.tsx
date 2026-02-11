"use client";

import { useState, useCallback } from "react";
import FileUpload from "@/components/FileUpload";
import ColumnMapper from "@/components/ColumnMapper";
import ResultsTable from "@/components/ResultsTable";
import { parseTxt, readExcelFile, parseExcelWithMapping, parseClientItems } from "@/lib/parsers";
import { reconcile } from "@/lib/reconcile";
import {
  fillSupplierForm,
  generateTxtSupplierOrder,
  generateReconciliationReport,
  downloadWorkbook,
} from "@/lib/exportForms";
import type {
  UploadedFile,
  ColumnMapping,
  SupplierItem,
  ReconciliationRow,
} from "@/lib/types";

type Step = "upload" | "reconcile" | "results";

export default function Home() {
  const [step, setStep] = useState<Step>("upload");
  const [isProcessing, setIsProcessing] = useState(false);

  // File states
  const [txtFile, setTxtFile] = useState<File | null>(null);
  const [txtItems, setTxtItems] = useState<SupplierItem[]>([]);

  const [supplier2File, setSupplier2File] = useState<UploadedFile | null>(null);
  const [supplier2Mapping, setSupplier2Mapping] = useState<Record<string, string>>({});

  const [supplier3File, setSupplier3File] = useState<UploadedFile | null>(null);
  const [supplier3Mapping, setSupplier3Mapping] = useState<Record<string, string>>({});

  const [clientFile, setClientFile] = useState<UploadedFile | null>(null);
  const [clientMapping, setClientMapping] = useState<Record<string, string>>({});

  const [results, setResults] = useState<ReconciliationRow[]>([]);

  // Handle TXT file
  const handleTxtFile = useCallback(async (file: File) => {
    const text = await file.text();
    const items = parseTxt(text);
    setTxtFile(file);
    setTxtItems(items);
  }, []);

  // Handle Excel files
  const handleSupplier2 = useCallback(async (file: File) => {
    const uploaded = await readExcelFile(file);
    setSupplier2File(uploaded);
    setSupplier2Mapping({});
  }, []);

  const handleSupplier3 = useCallback(async (file: File) => {
    const uploaded = await readExcelFile(file);
    setSupplier3File(uploaded);
    setSupplier3Mapping({});
  }, []);

  const handleClientFile = useCallback(async (file: File) => {
    const uploaded = await readExcelFile(file);
    setClientFile(uploaded);
    setClientMapping({});
  }, []);

  // Check if ready to reconcile
  const isReadyToReconcile =
    txtItems.length > 0 &&
    supplier2File &&
    supplier2Mapping.productName &&
    supplier2Mapping.price &&
    supplier3File &&
    supplier3Mapping.productName &&
    supplier3Mapping.price &&
    clientFile &&
    clientMapping.productName &&
    clientMapping.quantityNeeded;

  // Run reconciliation
  const handleReconcile = useCallback(() => {
    if (!supplier2File || !supplier3File || !clientFile) return;

    setIsProcessing(true);
    setTimeout(() => {
      const s2Items = parseExcelWithMapping(supplier2File, {
        productName: supplier2Mapping.productName,
        price: supplier2Mapping.price,
        orderQuantity: supplier2Mapping.orderQuantity,
      });

      const s3Items = parseExcelWithMapping(supplier3File, {
        productName: supplier3Mapping.productName,
        price: supplier3Mapping.price,
        orderQuantity: supplier3Mapping.orderQuantity,
      });

      const clientItems = parseClientItems(clientFile, {
        productName: clientMapping.productName,
        quantityNeeded: clientMapping.quantityNeeded,
      });

      const reconciled = reconcile(clientItems, txtItems, s2Items, s3Items);
      setResults(reconciled);
      setStep("results");
      setIsProcessing(false);
    }, 100);
  }, [
    txtItems,
    supplier2File,
    supplier2Mapping,
    supplier3File,
    supplier3Mapping,
    clientFile,
    clientMapping,
  ]);

  // Download handlers
  const handleDownloadReport = () => {
    const wb = generateReconciliationReport(results);
    downloadWorkbook(wb, "reconciliation-report.xlsx");
  };

  const handleDownloadSupplier1Order = () => {
    const wb = generateTxtSupplierOrder(results);
    downloadWorkbook(wb, "supplier1-order.xlsx");
  };

  const handleDownloadSupplier2Form = () => {
    if (!supplier2File) return;
    const mapping: ColumnMapping = {
      productName: supplier2Mapping.productName,
      price: supplier2Mapping.price,
      orderQuantity: supplier2Mapping.orderQuantity,
    };
    const wb = fillSupplierForm(supplier2File, mapping, results, "supplier2");
    if (wb) downloadWorkbook(wb, "supplier2-filled-form.xlsx");
  };

  const handleDownloadSupplier3Form = () => {
    if (!supplier3File) return;
    const mapping: ColumnMapping = {
      productName: supplier3Mapping.productName,
      price: supplier3Mapping.price,
      orderQuantity: supplier3Mapping.orderQuantity,
    };
    const wb = fillSupplierForm(supplier3File, mapping, results, "supplier3");
    if (wb) downloadWorkbook(wb, "supplier3-filled-form.xlsx");
  };

  const handleReset = () => {
    setStep("upload");
    setResults([]);
    setTxtFile(null);
    setTxtItems([]);
    setSupplier2File(null);
    setSupplier2Mapping({});
    setSupplier3File(null);
    setSupplier3Mapping({});
    setClientFile(null);
    setClientMapping({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Supplier Reconciliation
            </h1>
            <p className="text-sm text-gray-500">
              Compare prices & fill supplier order forms
            </p>
          </div>
          {step === "results" && (
            <button
              onClick={handleReset}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Start Over
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {step === "upload" && (
          <div className="space-y-8">
            {/* Upload Section */}
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                1. Upload Files
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileUpload
                  label="Supplier 1 (TXT)"
                  description="Structured price list (.txt)"
                  accept=".txt"
                  onFileSelected={handleTxtFile}
                  fileName={txtFile?.name}
                />
                <FileUpload
                  label="Client Items Needed"
                  description="Items to source (.xlsx, .csv)"
                  accept=".xlsx,.xls,.csv"
                  onFileSelected={handleClientFile}
                  fileName={clientFile?.file.name}
                />
                <FileUpload
                  label="Supplier 2 (Excel)"
                  description="Quotation form (.xlsx, .xls)"
                  accept=".xlsx,.xls"
                  onFileSelected={handleSupplier2}
                  fileName={supplier2File?.file.name}
                />
                <FileUpload
                  label="Supplier 3 (Excel)"
                  description="Quotation form (.xlsx, .xls)"
                  accept=".xlsx,.xls"
                  onFileSelected={handleSupplier3}
                  fileName={supplier3File?.file.name}
                />
              </div>
            </section>

            {/* TXT Preview */}
            {txtItems.length > 0 && (
              <section className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Supplier 1 (TXT) — {txtItems.length} items parsed
                </h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-1.5 text-left font-medium text-gray-600">Product Name</th>
                        <th className="px-3 py-1.5 text-right font-medium text-gray-600">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {txtItems.slice(0, 5).map((item, i) => (
                        <tr key={i} className="border-t border-gray-100">
                          <td className="px-3 py-1.5 text-gray-700">{item.name}</td>
                          <td className="px-3 py-1.5 text-right text-gray-700">
                            ${item.price.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {txtItems.length > 5 && (
                  <p className="mt-2 text-xs text-gray-400">
                    ...and {txtItems.length - 5} more items
                  </p>
                )}
              </section>
            )}

            {/* Column Mapping - Supplier 2 */}
            {supplier2File && (
              <section className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-gray-700">
                  Supplier 2 — Map Columns
                </h3>
                <ColumnMapper
                  headers={supplier2File.headers || []}
                  previewRows={supplier2File.previewRows || []}
                  fields={[
                    { key: "productName", label: "Product Name", required: true },
                    { key: "price", label: "Price", required: true },
                    { key: "orderQuantity", label: "Order Qty Column" },
                  ]}
                  mapping={supplier2Mapping}
                  onMappingChange={setSupplier2Mapping}
                />
              </section>
            )}

            {/* Column Mapping - Supplier 3 */}
            {supplier3File && (
              <section className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-gray-700">
                  Supplier 3 — Map Columns
                </h3>
                <ColumnMapper
                  headers={supplier3File.headers || []}
                  previewRows={supplier3File.previewRows || []}
                  fields={[
                    { key: "productName", label: "Product Name", required: true },
                    { key: "price", label: "Price", required: true },
                    { key: "orderQuantity", label: "Order Qty Column" },
                  ]}
                  mapping={supplier3Mapping}
                  onMappingChange={setSupplier3Mapping}
                />
              </section>
            )}

            {/* Column Mapping - Client Items */}
            {clientFile && (
              <section className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-gray-700">
                  Client Items Needed — Map Columns
                </h3>
                <ColumnMapper
                  headers={clientFile.headers || []}
                  previewRows={clientFile.previewRows || []}
                  fields={[
                    { key: "productName", label: "Product Name", required: true },
                    { key: "quantityNeeded", label: "Quantity Needed", required: true },
                  ]}
                  mapping={clientMapping}
                  onMappingChange={setClientMapping}
                />
              </section>
            )}

            {/* Reconcile Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleReconcile}
                disabled={!isReadyToReconcile || isProcessing}
                className={`rounded-xl px-8 py-3 text-sm font-semibold transition-all ${
                  isReadyToReconcile && !isProcessing
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Reconcile & Compare Prices"
                )}
              </button>
            </div>

            {!isReadyToReconcile && (txtFile || supplier2File || supplier3File || clientFile) && (
              <p className="text-center text-xs text-gray-400">
                Upload all 4 files and map required columns to enable reconciliation
              </p>
            )}
          </div>
        )}

        {step === "results" && (
          <div className="space-y-8">
            {/* Results */}
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Reconciliation Results
              </h2>
              <ResultsTable results={results} />
            </section>

            {/* Download Section */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Download Files
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  onClick={handleDownloadReport}
                  className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Reconciliation Report
                </button>
                <button
                  onClick={handleDownloadSupplier1Order}
                  className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm font-medium text-gray-700 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Supplier 1 Order
                </button>
                <button
                  onClick={handleDownloadSupplier2Form}
                  disabled={!supplier2Mapping.orderQuantity}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors ${
                    supplier2Mapping.orderQuantity
                      ? "border-gray-200 bg-gray-50 text-gray-700 hover:bg-green-50 hover:border-green-200 hover:text-green-700"
                      : "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Supplier 2 Form
                  {!supplier2Mapping.orderQuantity && (
                    <span className="text-xs text-gray-400">No qty column mapped</span>
                  )}
                </button>
                <button
                  onClick={handleDownloadSupplier3Form}
                  disabled={!supplier3Mapping.orderQuantity}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors ${
                    supplier3Mapping.orderQuantity
                      ? "border-gray-200 bg-gray-50 text-gray-700 hover:bg-green-50 hover:border-green-200 hover:text-green-700"
                      : "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Supplier 3 Form
                  {!supplier3Mapping.orderQuantity && (
                    <span className="text-xs text-gray-400">No qty column mapped</span>
                  )}
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
