"use client";

import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionTooltipProps {
  children: React.ReactNode;
  side: "left" | "right" | "top" | "bottom";
  align: "start" | "center" | "end";
  label: string;
  className?: string;
}

const ActionTooltip: React.FC<ActionTooltipProps> = ({
  children,
  side,
  align,
  label,
  className,
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger className={className}>{children}</TooltipTrigger>
        <TooltipContent align={align} side={side}>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActionTooltip;
