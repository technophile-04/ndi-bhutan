import { NextRequest, NextResponse } from "next/server";

let latestProof: any = null; // In-memory store (resets on server restart)

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log("📩 Webhook received:");
  console.log(JSON.stringify(body, null, 2));

  // Store only if it's a valid proof response
  if (body.type === "present-proof/presentation-result") {
    latestProof = body;
  }

  return NextResponse.json({ received: true });
}

// Optional: allow frontend polling to get the latest proof
export async function GET() {
  return NextResponse.json({ proof: latestProof });
}
