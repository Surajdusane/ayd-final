import { createTRPCRouter } from "@/trpc/init";
import { getAllDocumentsByUser, getDocumentById, updateDocument, createDocument, deleteDocument } from "@/db/queries/document";
import { authorizedProcedure } from "../procedures/authorizedProcedure";
import { createDocumentSchema, deleteDocumentSchema, getDocumentByIdSchema, updateDocumentSchema } from "../schemas/documents";
import { createClient } from "@/utils/supabase/server";
import { TRPCError } from "@trpc/server";

export const documentsRouter = createTRPCRouter({
    create: authorizedProcedure.input(createDocumentSchema).mutation(async ({ctx: {db, userId}, input}) => {
        return await createDocument(db, {
            id: input.id,
            name: input.name,
            userId: userId,
            metadata: input.metadata,
            path: input.path
        })
    }),
    remove: authorizedProcedure.input(deleteDocumentSchema).mutation(async ({ctx: {db, userId}, input}) => {
        const supabase = await createClient()
        const { error } = await supabase.storage.from('documents').remove([input.path])
        if (error) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: error.message })
        }
        return await deleteDocument(db, {
            id: input.path,
            userId: userId
        })
    }),
    update: authorizedProcedure.input(updateDocumentSchema).mutation(async ({ctx: {db, userId}, input}) => {
        return await updateDocument(db, {
            id: input.id,
            name: input.name,
            userId: userId
        })
    }),
    getById: authorizedProcedure.input(getDocumentByIdSchema).query(async ({ctx: {db, userId}, input}) => {
        return await getDocumentById(db, {
            id: input.id,
            userId: userId
        })
    }),
    getAllByUser: authorizedProcedure.query(async ({ctx: {db, userId}}) => {
        return await getAllDocumentsByUser(db, {
            userId: userId
        })
    })
})