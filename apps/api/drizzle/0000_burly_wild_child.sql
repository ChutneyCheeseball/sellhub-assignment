CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"inventory_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "inventory_check" CHECK ("products"."inventory_count" >= 0)
);
