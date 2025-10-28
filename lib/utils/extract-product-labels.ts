import { Product } from "@/types/product";
import {
  DynamicFormField,
  HIDDEN_FIELD_IDS,
} from "@/components/shared/dynamic-form-fields";

export interface ExtractedLabel {
  label: string;
  type: DynamicFormField["type"];
  count: number; // How many times this label appears
}

/**
 * Extracts unique labels from all products' additional info fields
 * Groups them by field type for better organization
 */
export function extractProductLabels(products: Product[]): {
  allLabels: ExtractedLabel[];
  labelsByType: Record<DynamicFormField["type"], ExtractedLabel[]>;
} {
  const labelMap = new Map<
    string,
    { type: DynamicFormField["type"]; count: number }
  >();

  // Extract labels from all products
  products.forEach((product) => {
    if (
      product.details?.additionalInfo &&
      Array.isArray(product.details.additionalInfo)
    ) {
      product.details.additionalInfo
        .filter((field) => !HIDDEN_FIELD_IDS.includes(field.id))
        .forEach((field: DynamicFormField) => {
          if (field.label && field.label.trim()) {
            const key = `${field.label.toLowerCase()}-${field.type}`;
            const existing = labelMap.get(key);

            if (existing) {
              existing.count++;
            } else {
              labelMap.set(key, {
                type: field.type,
                count: 1,
              });
            }
          }
        });
    }
  });

  // Convert to array and sort by frequency (most used first)
  const allLabels: ExtractedLabel[] = Array.from(labelMap.entries())
    .map(([key, data]) => ({
      label: key
        .split("-")
        .slice(0, -1)
        .join("-")
        .replace(/(^|\s)\S/g, (l) => l.toUpperCase()),
      type: data.type,
      count: data.count,
    }))
    .sort((a, b) => b.count - a.count);

  // Group by type
  const labelsByType: Record<DynamicFormField["type"], ExtractedLabel[]> = {
    text: [],
    number: [],
    percentage: [],
    textarea: [],
    image: [],
    list: [],
  };

  allLabels.forEach((label) => {
    labelsByType[label.type].push(label);
  });

  return {
    allLabels,
    labelsByType,
  };
}

/**
 * Get label suggestions for a specific field type
 */
export function getLabelSuggestionsForType(
  type: DynamicFormField["type"],
  products: Product[]
): string[] {
  const { labelsByType } = extractProductLabels(products);
  return labelsByType[type].map((item) => item.label);
}
