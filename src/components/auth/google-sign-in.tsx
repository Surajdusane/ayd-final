"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

import { Icons } from "@/components/ui/icons";

import { SubmitButton } from "../ui/submit-button";

export function GoogleSignIn() {
  const [isLoading, setLoading] = useState(false);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("return_to");

  const handleSignIn = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <SubmitButton
      onClick={handleSignIn}
      className="bg-primary text-secondary h-[40px] w-full px-6 py-4 font-medium"
      isSubmitting={isLoading}
    >
      <div className="flex items-center space-x-2">
        <Icons.Google />
        <span>Continue with Google</span>
      </div>
    </SubmitButton>
  );
}
