import { NextRequest, NextResponse } from "next/server";
import { recordHeartbeat, getActiveUserCount } from "@/lib/stats";

export async function POST(req: NextRequest) {
  try {
    const { visitorId } = await req.json();
    if (visitorId) {
      recordHeartbeat(visitorId);
    }
    return NextResponse.json({ count: getActiveUserCount() });
  } catch (error) {
    return NextResponse.json({ count: 1 }); // Fallback
  }
}
