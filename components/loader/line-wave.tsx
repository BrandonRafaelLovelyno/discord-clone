import React from "react";
import { LineWave } from "react-loader-spinner";

interface LineWaveLoaderProps {
  height: number;
  width: number;
}

const LineWaveLoader: React.FC<LineWaveLoaderProps> = ({ width, height }) => {
  return (
    <LineWave
      height={height.toString()}
      width={width.toString()}
      color="#9966ff"
      ariaLabel="LineWaveLoader"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      firstLineColor=""
      middleLineColor=""
      lastLineColor=""
    />
  );
};

export default LineWaveLoader;
