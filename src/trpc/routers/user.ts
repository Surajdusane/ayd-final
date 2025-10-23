import { deleteUser, getUserById, updateUser } from "@/db/queries/user";
import { createTRPCRouter } from "@/trpc/init";

import { authorizedProcedure } from "../procedures/authorizedProcedure";
import { updateUserSchema } from "../schemas/user";

export const userRouter = createTRPCRouter({
  me: authorizedProcedure.query(async ({ ctx: { db, session } }) => {
    const user = await getUserById(db, session.user.id);
    return user;
  }),

  update: authorizedProcedure.input(updateUserSchema).mutation(async ({ ctx: { db, session }, input }) => {
    return await updateUser(db, {
      id: session.user.id,
      ...input,
    });
  }),

  delete: authorizedProcedure.mutation(async ({ ctx: { supabase, db, session } }) => {
    const [data] = await Promise.all([
      deleteUser(db, session.user.id),
      supabase.auth.admin.deleteUser(session.user.id),
    ]);

    return data;
  }),
});
