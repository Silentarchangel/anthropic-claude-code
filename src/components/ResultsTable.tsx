"use client";

import type { ReconciliationRow } from "@/lib/types";

interface ResultsTableProps {
  results: ReconciliationRow[];
}

function formatPrice(price?: number): string {
  if (price === undefined) return "-";
  return `$${price.toFixed(2)}`;
}

export default function ResultsTable({ results }: ResultsTableProps) {
  const matched = results.filter((r) => r.bestSupplier);
  const unmatched = results.filter((r) => !r.bestSupplier);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex gap-4 text-sm">
        <div className="rounded-lg bg-blue-50 px-4 py-2 text-blue-700">
          <span className="font-semibold">{results.length}</span> total items
        </div>
        <div className="rounded-lg bg-green-50 px-4 py-2 text-green-700">
          <span className="font-semibold">{matched.length}</span> matched
        </div>
        {unmatched.length > 0 && (
          <div className="rounded-lg bg-amber-50 px-4 py-2 text-amber-700">
            <span className="font-semibold">{unmatched.length}</span> unmatched
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 font-semibold text-gray-700">Client Item</th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-right">Qty</th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-right">
                Supplier 1
                <span className="block text-xs font-normal text-gray-400">(TXT)</span>
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-right">
                Supplier 2
                <span className="block text-xs font-normal text-gray-400">(Excel)</span>
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-right">
                Supplier 3
                <span className="block text-xs font-normal text-gray-400">(Excel)</span>
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-right">Best Price</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, i) => {
              const isUnmatched = !row.bestSupplier;
              return (
                <tr
                  key={i}
                  className={`border-t border-gray-100 ${
                    isUnmatched ? "bg-amber-50" : ""
                  }`}
                >
                  <td className="px-4 py-2.5 font-medium text-gray-800">
                    {row.clientItemName}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-600">
                    {row.quantityNeeded}
                  </td>
                  <td
                    className={`px-4 py-2.5 text-right ${
                      row.bestSupplier === "supplier1"
                        ? "font-semibold text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {row.supplier1Match
                      ? formatPrice(row.supplier1Match.price)
                      : "-"}
                  </td>
                  <td
                    className={`px-4 py-2.5 text-right ${
                      row.bestSupplier === "supplier2"
                        ? "font-semibold text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {row.supplier2Match
                      ? formatPrice(row.supplier2Match.price)
                      : "-"}
                  </td>
                  <td
                    className={`px-4 py-2.5 text-right ${
                      row.bestSupplier === "supplier3"
                        ? "font-semibold text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {row.supplier3Match
                      ? formatPrice(row.supplier3Match.price)
                      : "-"}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-gray-800">
                    {row.bestPrice !== undefined
                      ? formatPrice(row.bestPrice)
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2.5">
                    {isUnmatched ? (
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                        No match
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        {row.bestSupplier?.replace("supplier", "Supplier ")}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
