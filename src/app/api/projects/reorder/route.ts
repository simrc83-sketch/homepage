import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json() as { ids: number[] };
    await Promise.all(
      ids.map((id, index) =>
        db.update(projects).set({ displayOrder: index, updatedAt: new Date() }).where(eq(projects.id, id))
      )
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/projects/reorder error:", error);
    return NextResponse.json({ error: "Failed to reorder" }, { status: 500 });
  }
}
