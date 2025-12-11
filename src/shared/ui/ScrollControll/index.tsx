import { Box } from "@mui/material";
import { FC, ReactNode, RefObject, useEffect, useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

interface IScrollControll {
  color?: string;
  boxRef: RefObject<HTMLDivElement>;
  children: ReactNode;
}

export const ScrollControll: FC<IScrollControll> = ({
  boxRef,
  children,
  color = "#4D636F",
}) => {
  const [update, setUpdate] = useState(0);

  const handleScroll = (toLeft?: boolean) => {
    if (boxRef.current) {
      const scrollLeft = boxRef.current?.scrollLeft || 0;

      boxRef.current.scrollTo({
        left: scrollLeft + (toLeft ? 200 : -200),
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handler = () => {
      setUpdate(Math.random());
    };
    if (boxRef.current) {
      boxRef.current.addEventListener("scroll", handler);
    }

    return () => boxRef.current?.removeEventListener("scroll", handler);
  }, [boxRef]);

  return (
    <Box sx={{ position: "relative" }}>
      {children}
      {boxRef.current?.scrollLeft !== undefined &&
        boxRef.current?.scrollLeft > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "0",
              transform: "translateY(-50%)",
              cursor: "pointer",
              zIndex: "999",
              px: "4px",
              py: "3px",
              background: `linear-gradient(to right, ${color} 80%, transparent)`,
            }}
            onClick={() => handleScroll()}
          >
            <ChevronLeftIcon sx={{ color: "#fff" }} />
          </Box>
        )}
      {boxRef.current?.scrollLeft !== undefined &&
        boxRef.current?.scrollWidth -
          boxRef.current?.scrollLeft -
          boxRef.current.clientWidth >
          30 && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              right: "0",
              transform: "translateY(-50%)",
              cursor: "pointer",
              zIndex: "999",
              px: "4px",
              py: "3px",
              background: `linear-gradient(to left, ${color} 80%, transparent)`,
            }}
            onClick={() => handleScroll(true)}
          >
            <ChevronRightIcon sx={{ color: "#fff" }} />
          </Box>
        )}
    </Box>
  );
};
