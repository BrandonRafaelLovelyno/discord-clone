"use client";

import { motion as m } from "framer-motion";

interface MotionDivProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

const MotionDivUp: React.FC<MotionDivProps> = ({
  className,
  children,
  delay,
}) => {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.8,
        delay: delay || 0,
      }}
      exit={{ opacity: 0, y: 20 }}
      className={className}
    >
      {children}
    </m.div>
  );
};

export default MotionDivUp;
