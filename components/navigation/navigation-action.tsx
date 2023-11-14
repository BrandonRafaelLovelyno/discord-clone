"use client";

import useModal from "@/hooks/useModal";
import { Plus } from "lucide-react";
import React from "react";

const NavigationAction = () => {
  const modal = useModal();
  return (
    <button
      className="w-full group h-fit"
      onClick={() => modal.onOpen("createServer")}
    >
      <div className="h-[50px] bg-neutral-700 p-2 rounded-[24px] group-hover:rounded-[15px] group-hover:bg-emerald-500 transition-all duration-300">
        <Plus className="w-full h-full text-emerald-500 group-hover:text-white" />
      </div>
    </button>
  );
};

export default NavigationAction;
