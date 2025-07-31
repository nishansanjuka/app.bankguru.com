import {
  createInstitution,
  deleteInstitution,
} from "@/lib/actions/institutions/institutions";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no Svix headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Error: Missing svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new NextResponse("Error verifying webhook", {
      status: 400,
    });
  }

  // Handle the webhook event
  const eventType = evt.type;

  switch (eventType) {
    case "organization.created":
      const res = await createInstitution({
        id: evt.data.id,
        typeId: String(
          evt.data.private_metadata?.accountCategory ??
            process.env.DEFAULT_INSTITUTION_TYPE_ID
        ),
        name: evt.data.name,
        licenseNumber: evt.data.id,
        countryCode: "LK",
      });

      if (!res.success) {
        console.log("Failed to create institution:", res.error);
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      break;
    case "organization.deleted":
      if (!evt.data.id)
        return NextResponse.json(
          { error: "Organization ID is missing" },
          { status: 400 }
        );

      await deleteInstitution(evt.data.id);
      break;
    default:
      break;
  }
  return NextResponse.json({ success: true });
}
