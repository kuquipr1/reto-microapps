"use client";

import React from "react";
import { CRMSidebar } from "@/components/crm/Sidebar";

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-h-screen">
      <CRMSidebar />
      <main className="flex-grow overflow-y-auto">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
