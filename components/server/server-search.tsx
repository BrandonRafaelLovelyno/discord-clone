"use client";

import { objType } from "./server-sidebar";
import React, { useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Search } from "lucide-react";

interface ServerSearchProps {
  data: {
    label: string;
    type: objType;
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}

const ServerSearch: React.FC<ServerSearchProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="w-full mt-4">
        <div className="flex items-center w-full px-3 font-bold text-gray-400 gap-x-3">
          <Search size={20} />
          Search
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">CTRL + </span>K
          </kbd>
        </div>
      </button>
      <CommandDialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <CommandInput placeholder="Search channel or member..." />
        <CommandList>
          <CommandEmpty>No result found</CommandEmpty>
          {data.map((dat) => (
            <CommandGroup key={dat.label} heading={`${dat.label} Channel`}>
              {dat.data?.map((d) => (
                <CommandItem
                  key={d.id}
                  className="flex flex-row w-full gap-x-5"
                >
                  {d.icon}
                  {d.name}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;
