import { useEffect, useState, useCallback } from "react";

export const useViewport = () => {
  const [width, setWidth] = useState(-1);

  const handleWindowResize = useCallback(() => {
    setWidth(window.innerWidth);
  }, [width]);

  useEffect(() => {
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [handleWindowResize]);

  return { width };
};
