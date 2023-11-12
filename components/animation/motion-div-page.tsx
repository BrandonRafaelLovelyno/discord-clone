"use client";

import { motion as m } from "framer-motion";

interface MotionDivProps {
  className?: string;
  children: React.ReactNode;
}

const MotionDivPage: React.FC<MotionDivProps> = ({ className, children }) => {
  return (
    <m.div
      initial={{ opacity: 0, y: 20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.4,
      }}
      exit={{ scale: 0.85, opacity: 0, y: 20 }}
      className={className}
    >
      {children}
    </m.div>
  );
};

export default MotionDivPage;
