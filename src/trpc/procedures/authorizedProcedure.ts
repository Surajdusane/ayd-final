import { TRPCError } from "@trpc/server";
import { baseProcedure } from "@/trpc/init";
import { betterAuthMiddleware } from "../middlewares/supabse-auth";

export const authorizedProcedure = baseProcedure.use(betterAuthMiddleware);