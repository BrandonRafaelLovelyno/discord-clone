"use client";

import { objType } from "./server-sidebar";
import React, { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

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

interface KeyboardEvent {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  preventDefault: () => void;
}

const ServerSearch: React.FC<ServerSearchProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const params = useParams();
  const router = useRouter();
  useEffect(() => {
    const keyDown = (ev: KeyboardEvent): void => {
      if (ev.key === "k" && (ev.metaKey || ev.ctrlKey)) {
        ev.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", keyDown);
    return () => document.removeEventListener("keydown", keyDown);
  }, [setIsOpen]);
  const onClick = ({ id, type }: { id: string; type: objType }) => {
    setIsOpen(false);
    if (type == "channel") {
      router.push(`/server/${params.serverId}/channel/${id}`);
    } else {
      router.push(`/server/${params.serverId}/conversation/${id}`);
    }
  };
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
            <CommandGroup key={dat.label} heading={`${dat.label}`}>
              {dat.data?.map((d) => (
                <CommandItem
                  key={d.id}
                  className="flex flex-row w-full cursor-pointer gap-x-5"
                  onSelect={() => {
                    onClick({ id: d.id, type: dat.type });
                  }}
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
