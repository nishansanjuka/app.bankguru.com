import { NextRequest, NextResponse } from "next/server";
import { ProductChatRequest } from "@/types/gurubot";

export async function POST(request: NextRequest) {
  try {
    const body: ProductChatRequest = await request.json();

    // Validate required fields
    if (!body.query || typeof body.query !== "string" || !body.query.trim()) {
      return NextResponse.json(
        { error: "Query is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (!body.product_id || typeof body.product_id !== "string" || !body.product_id.trim()) {
      return NextResponse.json(
        { error: "Product ID is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Prepare the request body with conversation_id handling
    const requestBody = {
      query: body.query,
      product_id: body.product_id,
      conversation_id: body.conversation_id || "",
      include_history: body.include_history ?? true,
    };

    // Call the actual product chat API
    const response = await fetch(`${process.env.GURUBOT_API_URL}/product-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Product Chat API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Product Chat API error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
