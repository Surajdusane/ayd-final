import { redis } from "@/redis";

import { deleteUser, getUserById, updateUser } from "@/db/queries/user";
import { createTRPCRouter } from "@/trpc/init";

import { authorizedProcedure } from "../procedures/authorizedProcedure";
import { updateUserSchema } from "../schemas/user";

export const userRouter = createTRPCRouter({
  me: authorizedProcedure.query(async ({ ctx: { db, session } }) => {
    try {
      const cached = await redis.get(`user:${session.user.id}`);
      if (cached) return cached 
    } catch (error) {
      console.error("Redis get error:", error);
    }

    const user = await getUserById(db, session.user.id);
    try {
      await redis.setex(`user:${session.user.id}`, 3600, JSON.stringify(user));
    } catch (error) {
      console.error("Redis set error:", error);
    }
    return user;
  }),

  update: authorizedProcedure.input(updateUserSchema).mutation(async ({ ctx: { db, session }, input }) => {
    const updatedUser = await updateUser(db, {
      id: session.user.id,
      ...input,
    });
    try {
      await redis.del(`user:${session.user.id}`); // Invalidate instead of update
    } catch (error) {
      console.error("Redis delete error:", error);
    }
    return updatedUser;
  }),

  delete: authorizedProcedure.mutation(async ({ ctx: { supabase, db, session } }) => {
    const userId = session.user.id;
    const [data] = await Promise.all([deleteUser(db, userId), supabase.auth.admin.deleteUser(userId)]);

    try {
      await redis.del(`user:${userId}`);
    } catch (error) {
      console.error("Redis delete error:", error);
    }
    return data;
  }),
});
