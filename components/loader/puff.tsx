import React from "react";
import { Puff } from "react-loader-spinner";

interface PuffLoaderProps {
  height: number;
  width: number;
}

const PuffLoader: React.FC<PuffLoaderProps> = ({ width, height }) => {
  return (
    <Puff
      height={`${height}`}
      width={`${width}`}
      radius={1}
      color="#71717a"
      ariaLabel="puff-loading"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />
  );
};

export default PuffLoader;
