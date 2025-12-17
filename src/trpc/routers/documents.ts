import { TRPCError } from "@trpc/server";
import { redis } from "@/redis";

import {
  createDocument,
  deleteDocument,
  getAllDocumentsByUser,
  getDocumentById,
  updateDocument,
} from "@/db/queries/document";
import { createTRPCRouter } from "@/trpc/init";
import { createClient } from "@/utils/supabase/server";

import { authorizedProcedure } from "../procedures/authorizedProcedure";
import {
  createDocumentSchema,
  deleteDocumentSchema,
  getDocumentByIdSchema,
  updateDocumentSchema,
} from "../schemas/documents";

type DocumentType = {
    id: string;
    name: string | null;
    createdAt: Date;
    metadata: Record<string, any>;
    userId: string;
    path: string;
}

export const documentsRouter = createTRPCRouter({
  // Create document
  create: authorizedProcedure.input(createDocumentSchema).mutation(async ({ ctx: { db, userId }, input }) => {
    const newDoc = await createDocument(db, {
      id: input.id,
      name: input.name,
      userId: userId,
      metadata: input.metadata,
      path: input.path,
    });

    // Revalidate cache after creating a document
    await Promise.all([
      redis.del(`user:${userId}:documents`), // invalidate user’s documents list
      redis.del(`document:${input.id}`), // just in case
    ]);

    return newDoc as DocumentType;
  }),

  // Remove document
  remove: authorizedProcedure.input(deleteDocumentSchema).mutation(async ({ ctx: { db, userId }, input }) => {
    const supabase = await createClient();
    const { error } = await supabase.storage.from("documents").remove([input.path]);
    if (error) {
      throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
    }

    const deleted = await deleteDocument(db, {
      id: input.path,
      userId: userId,
    });

    // Revalidate cache
    await Promise.all([
      redis.del(`user:${userId}:documents`),
      redis.del(`document:${input.path}`),
    ]);

    return deleted;
  }),

  // Update document
  update: authorizedProcedure.input(updateDocumentSchema).mutation(async ({ ctx: { db, userId }, input }) => {
    const updated = await updateDocument(db, {
      id: input.id,
      name: input.name,
      userId: userId,
    });

    // Revalidate cache
    await Promise.all([
      redis.del(`user:${userId}:documents`),
      redis.del(`document:${input.id}`),
    ]);

    return updated as DocumentType;
  }),

  // Get document by ID (cached)
  getById: authorizedProcedure.input(getDocumentByIdSchema).query(async ({ ctx: { db, userId }, input }) => {
    const cacheKey = `document:${input.id}`;

    // Check cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return cached as DocumentType
    }

    // Fetch from DB
    const doc = await getDocumentById(db, {
      id: input.id,
      userId: userId,
    });

    if (doc) {
      await redis.set(cacheKey, JSON.stringify(doc), {
      ex: 60 * 5, // cache for 5 min
      nx: true, // only set if not exists
    }); // cache for 5 min
    }

    return doc as DocumentType;
  }),

  // Get all documents by user (cached)
  getAllByUser: authorizedProcedure.query(async ({ ctx: { db, userId } }) => {
    const cacheKey = `user:${userId}:documents`;

    // Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return cached as DocumentType[]
    }

    // Fetch from DB
    const docs = await getAllDocumentsByUser(db, { userId });

    await redis.set(cacheKey, JSON.stringify(docs), {
      ex: 60 * 5, // cache for 5 min
      nx: true, // only set if not exists
    }); 

    return docs as DocumentType[];
  }),
});
