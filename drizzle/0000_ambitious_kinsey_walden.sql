CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"year" varchar(10) NOT NULL,
	"space_type" varchar(100) NOT NULL,
	"location" varchar(255),
	"description" text,
	"cover_image" text,
	"images" jsonb DEFAULT '[]'::jsonb,
	"featured" boolean DEFAULT false,
	"display_order" integer DEFAULT 0,
	"published" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
