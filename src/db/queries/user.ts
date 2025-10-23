import type { Database } from "@/db";
import { eq, inArray, sql } from "drizzle-orm";

import { users } from "../schema";

export const getUserById = async (db: Database, id: string) => {
  const [result] = await db.select().from(users).where(eq(users.id, id));

  return result;
};

export type UpdateUserParams = {
  id: string;
  email?: string | null;
  fullName?: string | null;
};

export const updateUser = async (db: Database, data: UpdateUserParams) => {
  const { id, ...updateData } = data;

  const [result] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();

  return result;
};

export const deleteUser = async (db: Database, id: string) => {
  await db.delete(users).where(eq(users.id, id));

  return { id };
};
