"use client";

interface ColumnMapperProps {
  headers: string[];
  previewRows: string[][];
  fields: { key: string; label: string; required?: boolean }[];
  mapping: Record<string, string>;
  onMappingChange: (mapping: Record<string, string>) => void;
}

export default function ColumnMapper({
  headers,
  previewRows,
  fields,
  mapping,
  onMappingChange,
}: ColumnMapperProps) {
  return (
    <div className="mt-3 space-y-3">
      {/* Column mapping dropdowns */}
      <div className="flex flex-wrap gap-3">
        {fields.map((field) => (
          <div key={field.key} className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <select
              value={mapping[field.key] || ""}
              onChange={(e) =>
                onMappingChange({ ...mapping, [field.key]: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">-- Select --</option>
              {headers.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Preview table */}
      {previewRows.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className="px-3 py-1.5 text-left font-medium text-gray-600 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, ri) => (
                <tr key={ri} className="border-t border-gray-100">
                  {headers.map((_, ci) => (
                    <td
                      key={ci}
                      className="px-3 py-1.5 text-gray-700 whitespace-nowrap"
                    >
                      {row[ci] ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
