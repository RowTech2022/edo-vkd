import { Box, Button } from "@mui/material";
import { FC, ReactNode, useEffect, useRef, useState } from "react";

interface IFixedBox {
  resize?: boolean;
  children?: ReactNode | JSX.Element;
}

export const FixedBox: FC<IFixedBox> = ({ children }) => {
  const myRef = useRef<HTMLDivElement>(null);
  const [fixedMode, setFixedMode] = useState(false);
  const [cords, setCords] = useState<any>({});
  const [dimensions, setDimensions] = useState<any>({});
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [addons, setAddons] = useState<any>({});
  const [_, setLastCords] = useState<any>({});
  const [isResizing, setIsResizing] = useState(false);

  const onChangeMode = () => {
    const isFixed = !fixedMode;

    if (isFixed && myRef.current) {
      // setting dimensions
      setDimensions({
        width: myRef.current.clientWidth,
        height: myRef.current.clientHeight,
      });

      // setting cords
      const { left = 0, top = 0 } =
        myRef.current?.getBoundingClientRect() || {};
      setCords({
        top,
        left,
      });

      setFixedMode(true);
    } else {
      setFixedMode(false);
    }
  };

  const onMouseDown = (e: any) => {
    setIsMousePressed(true);
    if (myRef.current) {
      const { left = 0, top = 0 } =
        myRef.current?.getBoundingClientRect() || {};

      setAddons({
        left: e.clientX - left,
        top: e.clientY - top,
      });

      setLastCords({
        left,
        top,
      });
    }
  };
  const onMouseUp = () => {
    setIsMousePressed(false);
    setIsResizing(false);
    setAddons({});
  };

  useEffect(() => {
    const handler = () => setIsResizing(true);
    myRef.current?.addEventListener("resize", handler);

    return () => myRef.current?.removeEventListener("resize", handler);
  }, [setIsResizing, myRef.current]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (isResizing) return;
      if (isMousePressed && fixedMode && myRef.current) {
        const { left: posX = 0, top: posY = 0 } =
          myRef.current.getBoundingClientRect();
        const { left = 0, top = 0 } = addons;

        const x = posX + myRef.current.clientWidth - left,
          y = posY + myRef.current.clientHeight - top;

        if (x < 50 && y < 50) return;

        setCords({
          top: e.clientY - top,
          left: e.clientX - left,
        });
      }
    };

    document.addEventListener("mousemove", handler);

    return () => document.removeEventListener("mousemove", handler);
  }, [fixedMode, isMousePressed]);

  return (
    <Box
      ref={myRef}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      sx={{
        paddingTop: 2,
        boxShadow: fixedMode ? "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" : "none",
        background: fixedMode ? "#F7F7FC" : "auto",
        position: fixedMode ? "fixed" : "relative",
        width: fixedMode ? dimensions.width : "auto",
        height: fixedMode ? dimensions.height : "auto",
        top: fixedMode ? `${cords.top}px` : "",
        left: fixedMode ? `${cords.left}px` : "",
        zIndex: 999,
        overflow: "auto",
        resize: "both",
      }}
    >
      <Button
        color="info"
        variant={fixedMode ? "contained" : "outlined"}
        sx={{
          position: "absolute",
          top: "20px",
          right: "4px",
          boxShadow: "none",
          zIndex: 999,
          color: fixedMode ? "rgb(156, 163, 175)" : "",
          "&:hover": {
            color: fixedMode ? "#fff" : "",
          },
        }}
        onClick={onChangeMode}
      >
        Плавающий блок
      </Button>
      {children}
    </Box>
  );
};
