export interface ProductComparisonRequest {
  product_ids: string[];
  conversation_id?: string;
}

export interface ProductComparisonProduct {
  id: string;
  name: string;
  institution: string;
  productType?: string;
  description?: string;
  fees?: string | number;
  eligibility?: string | number;
  terms?: string;
  logo?: string;
  image?: string;
  featured?: boolean;
  additionalInfo?: Array<{
    label: string;
    value: string | number | boolean;
    type?: string;
  }>;
}

export interface ProductComparisonResponse {
  summary: string;
  comparison: Record<string, unknown>;
  products: ProductComparisonProduct[];
  conversation_id: string;
}
