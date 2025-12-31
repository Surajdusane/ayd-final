import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { executionPlan, reactflowData } from "@/features/editor/types/workflow";

// Generate nanoid primary key
const generateId = () => nanoid(12);

export const users = pgTable("users", {
  // Matches Supabase auth.users.id
  id: text("id").primaryKey().notNull(), // Matches Supabase auth.users.id
  email: text("email"),
  fullName: text("full_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const workFlows = pgTable("workflows", {
  id: text("id").primaryKey().notNull().$defaultFn(generateId),
  name: text("name"),
  description: text("description"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const workflowData = pgTable("workflowdata", {
  id: text("id").primaryKey().notNull().$defaultFn(generateId),
  flowData: jsonb("flowdata").$type<reactflowData>(),
  plan: jsonb("plan").$type<executionPlan>(),
  workFlowId: text("work_flow_id")
    .notNull()
    .references(() => workFlows.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const documents = pgTable("documents", {
  id: text("id").primaryKey().notNull(),
  name: text(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  metadata: jsonb(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  path: text("path").notNull(),
});
