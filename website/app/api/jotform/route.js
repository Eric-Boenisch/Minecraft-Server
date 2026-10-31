import { getCellValue, updateCellValue, getColumnIndex, readRows } from "../../dashboard/components/excelService";

export async function POST(request) {
    const rows = await readRows();
  try {
    const body = await request.text();

    console.log("RAW WEBHOOK BODY:");
    console.log(body);

    let data;

    const name = "Edgar_";
    console.log(name);
    const EingezahltesGuthaben = getCellValue(rows, 2, getColumnIndex(rows, name)) + 5;
    console.log(EingezahltesGuthaben);
    updateCellValue(2 , getColumnIndex(rows, name), EingezahltesGuthaben);
    console.log(getCellValue(rows, 2, getColumnIndex(rows, name)) + 5);
    

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
