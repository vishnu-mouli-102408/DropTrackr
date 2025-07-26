import { useEffect, useState } from "react";

export const useMediaQuery = () => {
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop" | null>(
    null
  );
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setDimensions({ width, height });

      if (width <= 640) {
        setDevice("mobile");
      } else if (width >= 641 && width <= 1024) {
        setDevice("tablet");
      } else {
        setDevice("desktop");
      }
    };

    checkDevice();

    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return {
    device,
    width: dimensions?.width ?? window.innerWidth,
    height: dimensions?.height ?? window.innerHeight,
    isMobile: device === "mobile",
    isTablet: device === "tablet",
    isDesktop: device === "desktop",
  };
};
