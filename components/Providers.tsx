"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: any;
}) {
  const [queryClient] = useState(() => {
    const qc = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes stale time
          refetchOnWindowFocus: false, // disable auto-refetch on window focus
        },
      },
    });
    if (initialSettings) {
      qc.setQueryData(["site-settings"], initialSettings);
    }
    return qc;
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
