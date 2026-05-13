import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export const dynamic = "force-dynamic";

export async function GET() {
  const rawUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || process.env.DATABASE_URL;
  const dbUrl = rawUrl?.replace(/[?&]sslmode=[^&]+/gi, "");
  const masked = rawUrl ? rawUrl.replace(/:[^:@]+@/, ":****@") : "not found";
  try {
    const testPool = new Pool({
      connectionString: dbUrl,
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
    return Response.json({ success: true, message: "Table created", url: masked });
  } catch (error) {
    return Response.json({ success: false, error: String(error), url: masked }, { status: 500 });
  }
}
