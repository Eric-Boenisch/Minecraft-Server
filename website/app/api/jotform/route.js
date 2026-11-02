import { getCellValue, updateCellValue, getColumnIndex, readRows } from "../../dashboard/components/excelService";

export async function POST(request) {
  try {
    let data;
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const rawRequest = formData.get("rawRequest");

      if (typeof rawRequest !== "string" || rawRequest.length === 0) {
        return Response.json(
          { error: "No rawRequest found in multipart webhook data" },
          { status: 400 }
        );
      }

      data = JSON.parse(rawRequest);
    } else {
      const body = await request.text();

      console.log("RAW WEBHOOK BODY:");
      console.log(body);

      try {
        data = JSON.parse(body);
      } catch {
        const params = new URLSearchParams(body);
        const rawRequest = params.get("rawRequest");

        data = rawRequest
          ? JSON.parse(rawRequest)
          : Object.fromEntries(params.entries());
      }
    }

    console.log("PARSED JOTFORM DATA:");
    console.dir(data, { depth: null });

    const name = data?.q7_username;
    if (typeof name !== "string" || name.length === 0) {
      return Response.json(
        { error: "No q7_username found in webhook data" },
        { status: 400 }
      );
    }

    const rows = await readRows();
    const column = getColumnIndex(rows, name);
    if (column < 0) {
      return Response.json(
        { error: `No spreadsheet column found for username "${name}"` },
        { status: 400 }
      );
    }

    const eingezahltesGuthaben =
      (await getCellValue(rows, 2, column)) + 5;
    await updateCellValue(2, column, eingezahltesGuthaben);

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
