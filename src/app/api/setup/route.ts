import { pool } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        year VARCHAR(10) NOT NULL,
        space_type VARCHAR(100) NOT NULL,
        location VARCHAR(255),
        description TEXT,
        cover_image TEXT,
        images TEXT[],
        featured BOOLEAN DEFAULT FALSE,
        display_order INTEGER DEFAULT 0,
        published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    return Response.json({ success: true, message: "Table created" });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
