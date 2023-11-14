"use client";

import React from "react";
import { motion as m } from "framer-motion";
import { ColorRing } from "react-loader-spinner";

interface ColorRingLoaderProps {
  height: number;
  width: number;
}

const ColorRingLoader: React.FC<ColorRingLoaderProps> = ({ height, width }) => {
  return (
    <div className="flex items-center justify-center w-full h-full overflow-hidden">
      <m.div
        initial={{ scale: 0 }}
        animate={{ rotate: 180, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 0.4,
        }}
        exit={{ scale: 0, rotate: 180 }}
        className="flex items-center justify-center w-full"
      >
        <ColorRing
          visible={true}
          height={height.toString()}
          width={width.toString()}
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={["#9966ff", "#9933ff", "#ff66ff", "#6600ff", "#9999ff"]}
        />
      </m.div>
    </div>
  );
};

export default ColorRingLoader;
