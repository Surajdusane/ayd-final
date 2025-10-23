import { UserMenu } from "@/components/header/user-menu";
import { MobileMenu } from "@/components/sidebar/mobile-menu";

import { Trial } from "./trial";

export function Header() {
  return (
    <header className="desktop:sticky desktop:top-0 desktop:bg-background bg-background desktop:rounded-t-[10px] bg-opacity-70 sticky top-0 z-50 flex h-[70px] w-full items-center justify-between px-6 backdrop-blur-xl backdrop-filter md:static md:m-0 md:border-b md:backdrop-blur-none md:backdrop-filter">
      <MobileMenu />

      <div className="ml-auto flex space-x-2">
        <Trial />
        <UserMenu />
      </div>
    </header>
  );
}
