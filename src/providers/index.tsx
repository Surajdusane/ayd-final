"use client";

import * as React from "react";
import Script from "next/script";
import { Provider } from "jotai";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { TRPCReactProvider } from "@/trpc/client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange enableColorScheme>
      <TRPCReactProvider>
        <Provider>{children}</Provider>
      </TRPCReactProvider>
      <Script src="https://accounts.google.com/gsi/client" />
    </NextThemesProvider>
  );
}
