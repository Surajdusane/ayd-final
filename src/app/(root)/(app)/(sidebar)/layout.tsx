import { redirect } from "next/navigation";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <Sidebar />

      <div className="pb-8 md:ml-[70px]">
        <Header />
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
