import { redirect } from "next/navigation";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

export default async function Layout({ children }: { children: React.ReactNode }) {
  // TODO: validate user
  // const user = {
  //   fullName: "sahil",
  // };

  // if (!user) {
  //   redirect("/login");
  // }

  // if (!user.fullName) {
  //   redirect("/setup");
  // }

  return (
    // <HydrateClient>
    <div className="relative w-full">
      <SidebarProvider className="w-full">
        <Sidebar />

        <div className="w-full pb-8 md:ml-[70px]">
          <Header />
          <div className="px-6 py-6">{children}</div>
        </div>
      </SidebarProvider>
    </div>
    // </HydrateClient>
  );
}
