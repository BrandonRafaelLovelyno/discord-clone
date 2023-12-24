import React from "react";
import { ThreeCircles } from "react-loader-spinner";
import { motion as m } from "framer-motion";
interface ThreeCircleLoaderProps {
  size: number;
}

const ThreeCircleLoader: React.FC<ThreeCircleLoaderProps> = ({ size }) => {
  return (
    <m.div
      className="flex items-center justify-center w-full h-full"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ duration: 1 }}
    >
      <ThreeCircles
        height={`${size}`}
        width={`${size}`}
        color="#71717a"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="three-circles-rotating"
        outerCircleColor=""
        innerCircleColor=""
        middleCircleColor=""
      />
    </m.div>
  );
};

export default ThreeCircleLoader;
