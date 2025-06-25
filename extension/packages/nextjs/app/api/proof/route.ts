import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Get ngrok public URL
    const ngrokRes = await fetch(process.env.NGROK_API!);
    const ngrokData = await ngrokRes.json();
    const httpsTunnel = ngrokData.tunnels.find((t: any) => t.proto === "https");
    const publicUrl = httpsTunnel?.public_url;

    if (!publicUrl) throw new Error("Ngrok public URL not found.");

    const webhookUrl = `${publicUrl}/api/webhook`;
    console.log("🔗 Webhook URL:", webhookUrl);

    // 2. Authenticate with NDI
    const authRes = await fetch("https://staging.bhutanndi.com/authentication/v1/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.NDI_CLIENT_ID,
        client_secret: process.env.NDI_CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
    });

    const authData = await authRes.json();
    const accessToken = authData.access_token;

    // 3. Register webhook with NDI
    await fetch("https://demo-client.bhutanndi.com/webhook/v1/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        webhookId: process.env.WEBHOOK_ID,
        webhookURL: webhookUrl,
        authentication: {
          type: "OAuth2",
          version: "v2",
          data: { token: process.env.WEBHOOK_TOKEN },
        },
      }),
    });

    // 4. Create proof request
    const proofRes = await fetch("https://demo-client.bhutanndi.com/verifier/v1/proof-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        proofName: "Verify Foundational ID",
        proofAttributes: [
          {
            name: "ID Number",
            restrictions: [
              {
                schema_name: "https://dev-schema.ngotag.com/schemas/c7952a0a-e9b5-4a4b-a714-1e5d0a1ae076",
              },
            ],
          },
          {
            name: "Full Name",
            restrictions: [
              {
                schema_name: "https://dev-schema.ngotag.com/schemas/c7952a0a-e9b5-4a4b-a714-1e5d0a1ae076",
              },
            ],
          },
        ],
      }),
    });

    const proofData = await proofRes.json();

    // 5. Subscribe to webhook notifications
    await fetch("https://demo-client.bhutanndi.com/webhook/v1/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        webhookId: process.env.WEBHOOK_ID,
        threadId: proofData.data.proofRequestThreadId,
      }),
    });

    // ✅ Return QR code URL instead of deep link
    return NextResponse.json({ url: proofData.data.proofRequestURL });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create proof request" }, { status: 500 });
  }
}
