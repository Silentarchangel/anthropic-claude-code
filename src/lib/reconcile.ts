import * as stringSimilarity from "string-similarity";
import type {
  ClientItem,
  SupplierItem,
  SupplierMatch,
  ReconciliationRow,
} from "./types";

const SIMILARITY_THRESHOLD = 0.5;

function findBestMatch(
  clientName: string,
  supplierItems: SupplierItem[]
): SupplierMatch | undefined {
  if (supplierItems.length === 0) return undefined;

  const supplierNames = supplierItems.map((s) => s.normalizedName);
  const result = stringSimilarity.findBestMatch(clientName, supplierNames);

  if (result.bestMatch.rating >= SIMILARITY_THRESHOLD) {
    const matched = supplierItems[result.bestMatchIndex];
    return {
      name: matched.name,
      price: matched.price,
      rowIndex: matched.rowIndex,
    };
  }

  return undefined;
}

export function reconcile(
  clientItems: ClientItem[],
  supplier1Items: SupplierItem[],
  supplier2Items: SupplierItem[],
  supplier3Items: SupplierItem[]
): ReconciliationRow[] {
  return clientItems.map((client) => {
    const s1 = findBestMatch(client.normalizedName, supplier1Items);
    const s2 = findBestMatch(client.normalizedName, supplier2Items);
    const s3 = findBestMatch(client.normalizedName, supplier3Items);

    // Find best (lowest) price
    const candidates: { key: string; price: number }[] = [];
    if (s1) candidates.push({ key: "supplier1", price: s1.price });
    if (s2) candidates.push({ key: "supplier2", price: s2.price });
    if (s3) candidates.push({ key: "supplier3", price: s3.price });

    candidates.sort((a, b) => a.price - b.price);

    return {
      clientItemName: client.name,
      quantityNeeded: client.quantityNeeded,
      supplier1Match: s1,
      supplier2Match: s2,
      supplier3Match: s3,
      bestPrice: candidates[0]?.price,
      bestSupplier: candidates[0]?.key,
    };
  });
}
