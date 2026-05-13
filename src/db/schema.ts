import { pgTable, serial, text, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  year: varchar("year", { length: 10 }).notNull(),
  spaceType: varchar("space_type", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }),
  description: text("description"),
  coverImage: text("cover_image"),
  images: text("images").array(),
  featured: boolean("featured").default(false),
  displayOrder: integer("display_order").default(0),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
