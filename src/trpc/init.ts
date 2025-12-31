import { cache } from "react";
import { db } from "@/db";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import { createClient } from "@/utils/supabase/server";

export async function createTRPCContextInner() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Auth error:", error.message);
      console.log("--------------------------------------");
      return {
        session: null,
        db,
        supabase,
      };
    }

    const session = data?.user ? { user: data.user } : null;

    return {
      session,
      db,
      supabase,
    };
  } catch (error) {
    console.error("TRPC context error:", error);
    const supabase = await createClient();
    return {
      session: null,
      db,
      supabase,
    };
  }
}

export const createTRPCContext = cache(createTRPCContextInner);

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const middleware = t.middleware;
