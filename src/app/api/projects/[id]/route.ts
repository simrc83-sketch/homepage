import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { deleteUrlsFromCloudinary } from "@/lib/cloudinary";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [project] = await db.select().from(projects).where(eq(projects.id, parseInt(id)));
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (body.coverImage || body.images) {
      const [old] = await db.select().from(projects).where(eq(projects.id, parseInt(id)));
      if (old) {
        const oldUrls: (string | null)[] = [old.coverImage];
        const newImages: string[] = body.images ?? old.images ?? [];
        const oldImages: string[] = old.images ?? [];

        if (body.coverImage && body.coverImage !== old.coverImage) {
          oldUrls.push(old.coverImage ?? null);
        }

        const removedImages = oldImages.filter((img) => !newImages.includes(img));
        oldUrls.push(...removedImages);

        deleteUrlsFromCloudinary(oldUrls);
      }
    }

    const [updated] = await db
      .update(projects)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(projects.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const [project] = await db.select().from(projects).where(eq(projects.id, parseInt(id)));
    if (project) {
      const urls: (string | null)[] = [project.coverImage, ...(project.images ?? [])];
      deleteUrlsFromCloudinary(urls);
    }

    await db.delete(projects).where(eq(projects.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
