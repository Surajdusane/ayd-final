import type { Database } from "@/db";
import { and, eq } from "drizzle-orm";

import { documents } from "../schema";

export type getDocumentByIdParams = {
  id: string;
  userId: string;
};

export type UpdateDocumentParams = {
  id: string;
  name: string;
  userId: string;
};

export type CreateDocumentParams = {
  id: string;
  name: string;
  userId: string;
  metadata: Record<string, any>;
  path: string;
};

export type DeleteDocumentParams = {
    id: string;
    userId: string;
}

export type GetAllDocumentsByUserParams = {
  userId: string;
}

export const getDocumentById = async (db: Database, data: getDocumentByIdParams) => {
  const { id, userId } = data;
  const [result] = await db
    .select()
    .from(documents)
    .where(and(eq(documents.id, id), eq(documents.userId, userId)));

  return result;
};

export const updateDocument = async (db: Database, data: UpdateDocumentParams) => {
  const { id, userId, ...updateData } = data;

  const [result] = await db
    .update(documents)
    .set(updateData)
    .where(and(eq(documents.id, id), eq(documents.userId, userId)))
    .returning();

  return result;
};

export const createDocument = async (db: Database, data: CreateDocumentParams) => {
  const { id, userId, name, metadata, path } = data;

  const [result] = await db
    .insert(documents)
    .values({
      id,
      userId,
      name,
      metadata,
      path,
    })
    .returning();

  return result;
};

export const deleteDocument = async (db: Database, data: DeleteDocumentParams) => {
  const { id, userId } = data;

  await db
    .delete(documents)
    .where(and(eq(documents.path, id), eq(documents.userId, userId)));

  return { id };
};

export const getAllDocumentsByUser = async (db: Database, data: GetAllDocumentsByUserParams) => {
  const { userId } = data;

  const result = await db
    .select()
    .from(documents)
    .where(eq(documents.userId, userId));

  return result;
};