"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";

import { actionClient } from "./safe-action";

export const verifyOtpAction = actionClient
  .schema(
    z.object({
      token: z.string(),
      email: z.string(),
      redirectTo: z.string(),
    })
  )
  .action(async ({ parsedInput: { email, token, redirectTo } }) => {
    const supabase = await createClient();

    await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    // Validate that the session was actually established (similar to OAuth callback)
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("Failed to establish session after OTP verification");
    }

    redirect(redirectTo);
  });
