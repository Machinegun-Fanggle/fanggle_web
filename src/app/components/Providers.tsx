"use client";

import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
import NoSSRWrapper from "@/app/NoSSRWrapper"

interface Props {
    children: ReactNode;
}
function Providers({ children }: Props) {
    return (
        <NoSSRWrapper>            
            <SessionProvider>
                {children}
            </SessionProvider>
        </NoSSRWrapper>
    )
}

export default Providers;