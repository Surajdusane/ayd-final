"use client";

import { useState } from "react";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

export function FeedbackForm() {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // TODO: implement feedback form action
  const action = {
    execute: async ({ feedback }: { feedback: string }) => {
      console.log(feedback);
    },
    status: "idle",
  };

  //   const action = useAction(sendFeebackAction, {
  //     onSuccess: () => {
  //       setValue("");
  //       setSubmitted(true);

  //       setTimeout(() => {
  //         setSubmitted(false);
  //       }, 3000);
  //     },
  //   });

  return (
    <Popover>
      <PopoverTrigger asChild className="hidden md:block">
        <Button variant="outline" className="h-8 rounded-full p-0 px-3 text-xs font-normal text-[#878787]">
          Feedback
        </Button>
      </PopoverTrigger>
      <PopoverContent className="h-[200px] w-[320px]" sideOffset={10} align="end">
        {submitted ? (
          <div className="mt-10 flex flex-col items-center justify-center space-y-1 text-center">
            <p className="text-sm font-medium">Thank you for your feedback!</p>
            <p className="text-sm text-[#4C4C4C]">We will be back with you as soon as possible</p>
          </div>
        ) : (
          <form className="space-y-4">
            <Textarea
              name="feedback"
              value={value}
              required
              autoFocus
              placeholder="Ideas to improve this page or issues you are experiencing."
              className="h-[120px] resize-none"
              onChange={(evt) => setValue(evt.target.value)}
            />

            <div className="mt-1 flex items-center justify-end">
              <Button
                type="button"
                onClick={() => action.execute({ feedback: value })}
                disabled={value.length === 0 || action.status === "executing"}
              >
                {action.status === "executing" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
              </Button>
            </div>
          </form>
        )}
      </PopoverContent>
    </Popover>
  );
}
