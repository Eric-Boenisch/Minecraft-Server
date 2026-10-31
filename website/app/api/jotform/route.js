
export async function POST(request) {
  try {
    const body = await request.text();

    console.log("RAW WEBHOOK BODY:");
    console.log(body);

    let data;

    try {
      data = JSON.parse(body);
    } catch {
      const params = new URLSearchParams(body);
      const rawRequest = params.get("rawRequest");

      if (!rawRequest) {
        return Response.json(
          { error: "No rawRequest found" },
          { status: 400 }
        );
      }

      data = JSON.parse(rawRequest);
    }

    console.log("PARSED JOTFORM DATA:");
    console.dir(data, { depth: null });

    return Response.json({
      success: true
    });

  } catch (error) {
    console.error("Webhook error:", error);

    return Response.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}
