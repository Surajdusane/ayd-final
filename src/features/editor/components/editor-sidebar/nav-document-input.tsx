"use client";

import { Icons } from "@/components/ui/icons";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { InputType } from "../../types/input-types";

export function NavDocumentInput({
  items,
  onClick,
}: {
  items: {
    name: string;
    id: string;
  }[];
  onClick: (id: string) => void;
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Your Documents</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton onClick={() => onClick(item.id)}>
              <Icons.Description />
              <span>{item.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
