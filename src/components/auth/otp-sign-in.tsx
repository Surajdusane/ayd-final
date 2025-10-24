"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { verifyOtpAction } from "@/actions/verify-otp-action";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { SubmitButton } from "@/components/ui/submit-button";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

const formSchema = z.object({
  email: z.string().email(),
});

type Props = {
  className?: string;
};

export function OTPSignIn({ className }: Props) {
  const verifyOtp = useAction(verifyOtpAction);
  const [isLoading, setLoading] = useState(false);
  const [isSent, setSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState<string>();
  const supabase = createClient();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit({ email }: z.infer<typeof formSchema>) {
    setLoading(true);

    setEmail(email);

    await supabase.auth.signInWithOtp({ email });

    setSent(true);
    setLoading(false);
  }

  async function onComplete(token: string) {
    if (!email) return;

    setIsVerifying(true);

    verifyOtp.execute({
      token,
      email,
      redirectTo: `${window.location.origin}/${searchParams.get("return_to") || ""}`,
    });
  }

  if (isSent) {
    return (
      <div className={cn("flex flex-col items-center space-y-4", className)}>
        <div className="flex h-[62px] w-full items-center justify-center">
          {verifyOtp.isExecuting || isVerifying ? (
            <div className="bg-background/95 border-input flex h-full w-full items-center justify-center border">
              <div className="bg-background flex items-center space-x-2 rounded-md px-4 py-2 shadow-sm">
                <Spinner size={16} className="text-primary" />
                <span className="text-foreground text-sm font-medium">Verifying...</span>
              </div>
            </div>
          ) : (
            <InputOTP
              maxLength={6}
              autoFocus
              onComplete={onComplete}
              disabled={verifyOtp.isExecuting || isVerifying}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index.toString()} {...slot} className="h-[62px] w-[62px]" />
                  ))}
                </InputOTPGroup>
              )}
            />
          )}
        </div>

        <div className="flex space-x-2">
          <span className="text-sm text-[#878787]">Didn't receive the email?</span>
          <button
            onClick={() => setSent(false)}
            type="button"
            className="text-primary text-sm font-medium underline"
            disabled={verifyOtp.isExecuting || isVerifying}
          >
            Resend code
          </button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={cn("flex flex-col space-y-4", className)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter email address"
                    className="focus-visible:ring-transparent"
                    {...field}
                    autoCapitalize="false"
                    autoCorrect="false"
                    spellCheck="false"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <SubmitButton
            type="submit"
            className="bg-primary text-secondary flex h-[40px] w-full space-x-2 px-6 py-4 font-medium"
            isSubmitting={isLoading}
          >
            Continue
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
