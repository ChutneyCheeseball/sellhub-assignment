import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import dotenv from "dotenv";

// Load our database URL
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
export const database = drizzle({ client: sql, logger: true });
