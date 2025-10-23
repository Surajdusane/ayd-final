import { VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Spinner } from "./spinner";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function SubmitButton({
  children,
  isSubmitting,
  disabled,
  ...props
}: {
  children: React.ReactNode;
  isSubmitting: boolean;
  disabled?: boolean;
} & ButtonProps) {
  return (
    <Button disabled={isSubmitting || disabled} {...props} className={cn("relative", props.className)}>
      <span className={cn(isSubmitting && "invisible")}>{children}</span>
      {isSubmitting && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </Button>
  );
}
