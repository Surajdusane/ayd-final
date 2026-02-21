import "dotenv/config";

import { neon } from "@neondatabase/serverless";
// export const client = postgres(connectionString, {
//   prepare: false,
//   max: 5,
//   idle_timeout: 20,
//   connect_timeout: 10,
// });
// import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const connectionString = process.env.DATABASE_URL!;

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

export type Database = typeof db;
