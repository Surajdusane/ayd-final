import { TRPCError } from "@trpc/server";

import { middleware } from "@/trpc/init";

export const betterAuthMiddleware = middleware(async function isAuthorized(opts) {
  const session = opts.ctx.session;
  const user = session?.user;
  const userId = user?.id;

  // More specific error messages for debugging
  if (!session) {
    console.log("❌ Auth failed: No session");
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "No session found",
    });
  }

  if (!user) {
    console.log("❌ Auth failed: No user in session");
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "No user in session",
    });
  }

  if (!userId) {
    console.log("❌ Auth failed: No user ID");
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "No user ID",
    });
  }

  // console.log("✅ Authorization successful for user:", userId);

  return opts.next({
    ctx: {
      session,
      userId,
      db: opts.ctx.db,
      supabase: opts.ctx.supabase,
    },
  });
});
