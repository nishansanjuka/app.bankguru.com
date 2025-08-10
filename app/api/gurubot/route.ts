import { NextRequest, NextResponse } from "next/server";
import { GuruBotRequest } from "@/types/gurubot";

export async function POST(request: NextRequest) {
  try {
    const body: GuruBotRequest = await request.json();

    // Validate required fields
    if (!body.query || typeof body.query !== "string" || !body.query.trim()) {
      return NextResponse.json(
        { error: "Query is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Call the actual GuruBot API
    const response = await fetch(`${process.env.GURUBOT_API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`GuruBot API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GuruBot API error:", error);

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
