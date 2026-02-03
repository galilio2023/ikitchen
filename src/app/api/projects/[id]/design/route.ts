import { NextResponse } from "next/server";

export async function PATCH() {
  return NextResponse.json({ error: "Endpoint removed. Use /api/kitchens/[id]/design" }, { status: 410 });
}
