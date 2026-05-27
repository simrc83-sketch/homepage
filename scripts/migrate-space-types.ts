import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { projects } from "../src/db/schema";
import { eq } from "drizzle-orm";

config({ path: ".env.local" });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const MAPPING: Record<string, string> = {
  Residential: "주거공간",
  Commercial: "상업공간",
  Hospitality: "숙박공간",
  Office: "오피스",
  Other: "기타",
};

async function main() {
  for (const [oldVal, newVal] of Object.entries(MAPPING)) {
    const result = await db
      .update(projects)
      .set({ spaceType: newVal })
      .where(eq(projects.spaceType, oldVal));
    console.log(`${oldVal} → ${newVal}: ${result.rowCount ?? 0}건 업데이트`);
  }
  await pool.end();
}

main().catch(console.error);
