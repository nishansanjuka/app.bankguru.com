import { NextRequest, NextResponse } from "next/server";
import { ProductComparisonRequest } from "@/types/product-comparison";

export async function POST(request: NextRequest) {
  try {
    const body: ProductComparisonRequest = await request.json();
    
    // Validate required fields
    if (!body.product_ids || !Array.isArray(body.product_ids) || body.product_ids.length === 0) {
      return NextResponse.json(
        { error: "Product IDs are required and must be a non-empty array" },
        { status: 400 }
      );
    }

    // Call the actual product comparison API
    const response = await fetch('http://localhost:8085/compare-products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error(`Product comparison API error: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Product comparison API error:", error);
    
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error occurred"
      },
      { status: 500 }
    );
  }
}
