import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export const requireAuth = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/login");
  }

  return data.user;
};

export const requireUnAuth = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (data?.user) {
    redirect("/");
  }
};
