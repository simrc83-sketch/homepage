import { Pool } from "pg";

export const dynamic = "force-dynamic";

export async function GET() {
  const poolUrl = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL;
  const cleanedUrl = poolUrl?.replace(/[?&]sslmode=[^&]+/gi, (m) => m.startsWith("?") ? "?" : "");
  const masked = poolUrl?.replace(/:[^:@]+@/, ":****@");
  const cleanedMasked = cleanedUrl?.replace(/:[^:@]+@/, ":****@");
  const info = { poolUrl: masked, cleanedUrl: cleanedMasked };

  try {
    const testPool = new Pool({
      connectionString: cleanedUrl,
      ssl: { rejectUnauthorized: false },
    });
    await testPool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        year VARCHAR(10) NOT NULL,
        space_type VARCHAR(100) NOT NULL,
        location VARCHAR(255),
        description TEXT,
        cover_image TEXT,
        images JSONB DEFAULT '[]'::jsonb,
        featured BOOLEAN DEFAULT FALSE,
        display_order INTEGER DEFAULT 0,
        published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await testPool.end();
    return Response.json({ success: true, message: "Table created", ...info });
  } catch (error) {
    return Response.json({ success: false, error: String(error), ...info }, { status: 500 });
  }
}
