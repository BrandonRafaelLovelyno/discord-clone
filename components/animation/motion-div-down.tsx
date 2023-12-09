import React from "react";
import { motion as m } from "framer-motion";

interface MotionDivProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

const MotionDivDown: React.FC<MotionDivProps> = ({
  className,
  children,
  delay,
}) => {
  return (
    <m.div
      initial={{ y: -48 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.8,
        delay: delay || 0,
      }}
      exit={{ y: -48 }}
      className={className}
    >
      {children}
    </m.div>
  );
};

export default MotionDivDown;
