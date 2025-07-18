"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import DropdownProfile from "./DropdownProfile";
import { ModeToggle } from "./ModeToggle";

type HeaderProps = {
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarCollapsed: boolean;
};


const SearchDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (val: boolean) => void }) => {
  return (
  <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="sm:max-w-[500px] bg-black text-white border border-white/10">
    <DialogHeader>
      <DialogTitle className="text-white text-sm">Search</DialogTitle>
    </DialogHeader>
    <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-md">
      <Icon icon="lucide:search" className="text-white" />
      <input
        type="text"
        placeholder="Search..."
        className="w-full bg-transparent outline-none text-sm text-white"
        autoFocus
      />
    </div>
  </DialogContent>
</Dialog>
  );
};

const SearchBar = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-white/10 rounded-[3px] min-w-52 px-2 py-1.5 hover:bg-white/20 transition"
    >
      <Icon icon="lucide:search" className="text-white" width={18} />
      <span className="text-sm text-white opacity-60 hidden sm:block">Search...</span>
      <div className="flex items-center gap-x-1 ml-auto">
        <kbd className="px-1.5 py-1 bg-black text-[10px] text-gray-300 rounded">CTRL</kbd>
        <kbd className="px-1.5 py-1 bg-black text-[10px] text-gray-300 rounded">K</kbd>
      </div>
    </button>
  );
};

function Header({ setIsSidebarCollapsed, isSidebarCollapsed }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const sidebarWidth = isSidebarCollapsed ? "w-[calc(100vw_-_60px)]" : "w-[calc(100vw_-_250px)]";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 z-20 flex items-center justify-between pl-4 pr-8 py-4 border-b-2 bg-neutral-950 text-white transition-all duration-300 ${sidebarWidth}`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            className="px-2.5 relative after:right-0 after:top-[5px] after:content-[''] after:absolute after:bg-white/20 after:h-[15px] after:w-[2px] after:rounded-4xl hover:bg-black/30 transition-colors duration-300"
          >
            <Icon icon="lucide:sidebar" width="24" height="24" />
          </button>

          <div className="flex items-center gap-1 text-sm text-gray-300">
            <span>Dashboard</span>
            <Icon icon="bi:slash" width="20" height="20" />
            <span>Overview</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SearchBar onClick={() => setIsSearchOpen(true)} />
          {/* <span className="text-lg font-semibold hidden md:block">Header Component</span> */}
          <DropdownProfile />
          <ModeToggle />
        </div>
      </header>

      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
}

export default Header;
