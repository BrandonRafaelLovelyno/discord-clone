import { Plus } from "lucide-react";
import React from "react";

const SidebarAction = () => {
  return (
    <button className="w-full group h-fit">
      <div className="h-[50px] bg-neutral-700 p-2 rounded-[24px] group-hover:rounded-[15px] group-hover:bg-emerald-500 transition-all duration-300">
        <Plus className="w-full h-full text-white" />
      </div>
    </button>
  );
};

export default SidebarAction;
