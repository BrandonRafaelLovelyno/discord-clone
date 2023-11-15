import { useEffect, useState } from "react";

const useOrigin = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return "";
  }
  const origin = window && window.location.href ? window.location.origin : "";
  return origin;
};

export default useOrigin;
