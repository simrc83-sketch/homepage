import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featuredOnly = searchParams.get("featured") === "true";

    let query = db.select().from(projects).where(eq(projects.published, true));

    const result = featuredOnly
      ? await db.select().from(projects).where(eq(projects.featured, true)).orderBy(asc(projects.displayOrder))
      : await db.select().from(projects).where(eq(projects.published, true)).orderBy(asc(projects.displayOrder));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const [project] = await db.insert(projects).values(body).returning();
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
