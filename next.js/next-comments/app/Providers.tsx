"use client";

import { SessionProvider, SessionProviderProps } from "next-auth/react";

export default function Providers({ children }: SessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
