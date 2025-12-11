import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Crop } from "@mui/icons-material";

interface Point {
  x: number;
  y: number;
}

interface CropArea {
  center: Point;
  radius: number;
}

export interface CropResult {
  center: Point;
  radius: number;
  imageWidth: number;
  imageHeight: number;
  originalImage: File;
}

const ImageCropper: React.FC<{
  open: boolean;
  imageFile: File;
  onClose: () => void;
  onCrop: (result: CropResult) => void;
}> = ({ open, imageFile, onClose, onCrop }) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const [hoveredHandle, setHoveredHandle] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const maxWidth = window.innerWidth * 0.8;
        const maxHeight = window.innerHeight * 0.7;
        setContainerSize({ width: maxWidth, height: maxHeight });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (!imageFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        const initialRadius = Math.min(img.width, img.height) * 0.1;
        setCropArea({
          center: { x: img.width / 2, y: img.height / 2 },
          radius: initialRadius,
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    if (!image || !containerSize.width) return;
    const scaleX = containerSize.width / image.width;
    const scaleY = containerSize.height / image.height;
    const newScale = Math.min(scaleX, scaleY, 1);
    setScale(newScale);
  }, [image, containerSize]);

  useEffect(() => {
    if (!image || !canvasRef.current || !cropArea) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const displayWidth = image.width * scale;
    const displayHeight = image.height * scale;
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      0,
      0,
      displayWidth,
      displayHeight
    );
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, displayWidth, displayHeight);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(
      cropArea.center.x * scale,
      cropArea.center.y * scale,
      cropArea.radius * scale,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(
      cropArea.center.x * scale,
      cropArea.center.y * scale,
      cropArea.radius * scale,
      0,
      Math.PI * 2
    );
    ctx.stroke();

    const handleSize = 5;
    const handlePositions = [
      0,
      Math.PI / 4,
      Math.PI / 2,
      (3 * Math.PI) / 4,
      Math.PI,
      (5 * Math.PI) / 4,
      (3 * Math.PI) / 2,
      (7 * Math.PI) / 4,
    ];
    handlePositions.forEach((angle) => {
      const handleX =
        cropArea.center.x * scale + Math.cos(angle) * cropArea.radius * scale;
      const handleY =
        cropArea.center.y * scale + Math.sin(angle) * cropArea.radius * scale;
      ctx.strokeStyle = "#000";
      ctx.fillStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(handleX, handleY, handleSize, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();
    });
  }, [image, cropArea, scale]);

  const getMousePosition = (e: React.MouseEvent) => {
  if (!canvasRef.current) return { x: 0, y: 0 };
  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
};

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!cropArea || !image) return;
    const mousePos = getMousePosition(e);
    const center = cropArea.center;
    const radius = cropArea.radius;
    const distanceToCenter = Math.sqrt(
      Math.pow(mousePos.x - center.x, 2) + Math.pow(mousePos.y - center.y, 2)
    );
    if (distanceToCenter <= radius * 0.7) {
      setIsDragging(true);
      setDragHandle("center");
      return;
    }

    const handlePositions = [
      { angle: 0, name: "right" },
      { angle: Math.PI / 4, name: "right-bottom" },
      { angle: Math.PI / 2, name: "bottom" },
      { angle: (3 * Math.PI) / 4, name: "left-bottom" },
      { angle: Math.PI, name: "left" },
      { angle: (5 * Math.PI) / 4, name: "left-top" },
      { angle: (3 * Math.PI) / 2, name: "top" },
      { angle: (7 * Math.PI) / 4, name: "right-top" },
    ];

    for (const handle of handlePositions) {
      const handleX = center.x + Math.cos(handle.angle) * radius;
      const handleY = center.y + Math.sin(handle.angle) * radius;
      const distance = Math.sqrt(
        Math.pow(mousePos.x - handleX, 2) + Math.pow(mousePos.y - handleY, 2)
      );
      if (distance <= 15 / scale) {
        setIsDragging(true);
        setDragHandle(handle.name);
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const mousePos = getMousePosition(e);
    if (!mousePos || !cropArea || !image) return;

    if (!isDragging) {
      const directions = [
        { angle: 0, name: "ew-resize" },
        { angle: Math.PI / 4, name: "nwse-resize" },
        { angle: Math.PI / 2, name: "ns-resize" },
        { angle: (3 * Math.PI) / 4, name: "nesw-resize" },
        { angle: Math.PI, name: "ew-resize" },
        { angle: (5 * Math.PI) / 4, name: "nwse-resize" },
        { angle: (3 * Math.PI) / 2, name: "ns-resize" },
        { angle: (7 * Math.PI) / 4, name: "nesw-resize" },
      ];
      let found = null;
      for (const d of directions) {
        const x = cropArea.center.x + Math.cos(d.angle) * cropArea.radius;
        const y = cropArea.center.y + Math.sin(d.angle) * cropArea.radius;
        const dist = Math.sqrt(
          Math.pow(mousePos.x - x, 2) + Math.pow(mousePos.y - y, 2)
        );
        if (dist <= 15 / scale) {
          found = d.name;
          break;
        }
      }
      setHoveredHandle(found);
      return;
    }

    if (!dragHandle) return;

    let newCenter = { ...cropArea.center };
    let newRadius = cropArea.radius;
    const minRadius = Math.min(image.width, image.height) * 0.05;
    const maxRadius = Math.min(image.width, image.height) / 2;

    switch (dragHandle) {
      case "center":
        newCenter = {
          x: Math.max(newRadius, Math.min(image.width - newRadius, mousePos.x)),
          y: Math.max(
            newRadius,
            Math.min(image.height - newRadius, mousePos.y)
          ),
        };
        break;
      case "right":
        newRadius = Math.max(
          minRadius,
          Math.min(maxRadius, mousePos.x - newCenter.x)
        );
        break;
      case "left":
        newRadius = Math.max(
          minRadius,
          Math.min(maxRadius, newCenter.x - mousePos.x)
        );
        newCenter.x = mousePos.x + newRadius;
        break;
      case "top":
        newRadius = Math.max(
          minRadius,
          Math.min(maxRadius, newCenter.y - mousePos.y)
        );
        newCenter.y = mousePos.y + newRadius;
        break;
      case "bottom":
        newRadius = Math.max(
          minRadius,
          Math.min(maxRadius, mousePos.y - newCenter.y)
        );
        break;
      case "right-top":
        newRadius = Math.max(
          minRadius,
          Math.min(
            maxRadius,
            Math.min(mousePos.x - newCenter.x, newCenter.y - mousePos.y)
          )
        );
        break;
      case "right-bottom":
        newRadius = Math.max(
          minRadius,
          Math.min(
            maxRadius,
            Math.min(mousePos.x - newCenter.x, mousePos.y - newCenter.y)
          )
        );
        break;
      case "left-top":
        newRadius = Math.max(
          minRadius,
          Math.min(
            maxRadius,
            Math.min(newCenter.x - mousePos.x, newCenter.y - mousePos.y)
          )
        );
        newCenter.x = mousePos.x + newRadius;
        newCenter.y = mousePos.y + newRadius;
        break;
      case "left-bottom":
        newRadius = Math.max(
          minRadius,
          Math.min(
            maxRadius,
            Math.min(newCenter.x - mousePos.x, mousePos.y - newCenter.y)
          )
        );
        newCenter.x = mousePos.x + newRadius;
        break;
    }
    setCropArea({ center: newCenter, radius: newRadius });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragHandle(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cropArea || !image) return;
    const delta = e.deltaY > 0 ? -1 : 1;
    const minRadius = Math.min(image.width, image.height) * 0.05;
    const maxRadius = Math.min(image.width, image.height) / 2;
    setCropArea({
      ...cropArea,
      radius: Math.max(
        minRadius,
        Math.min(maxRadius, cropArea.radius + delta * cropArea.radius * 0.1)
      ),
    });
    e.preventDefault();
  };

  const handleCrop = () => {
    if (!image || !cropArea) return;
    onCrop({
      center: {
        x: Math.round(cropArea.center.x),
        y: Math.round(cropArea.center.y),
      },
      radius: Math.round(cropArea.radius),
      imageWidth: image.width,
      imageHeight: image.height,
      originalImage: imageFile,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: "75vw",
          width: "100%",
          maxHeight: "90vh",
          height: "100%",
          borderRadius: '34px !important'
        },
      }}
    >
      <DialogTitle className="tw-bg-primary tw-rounded-t-[30px]">
        Выберите область изображения
      </DialogTitle>
      <DialogContent
        ref={containerRef}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "auto",
          padding: "0px !important",
          backgroundColor: "#f0f0f0",
          height: "100%",
        }}
      >
        <Box
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          sx={{ position: "relative", lineHeight: 0 }}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            style={{
              cursor: isDragging
                ? dragHandle === "center"
                  ? "grabbing"
                  : hoveredHandle || "grab"
                : hoveredHandle || "grab",
              maxHeight: "70vh",
              display: "block",
              border: "1px solid #ddd",
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions className="tw-px-4 tw-py-2 tw-flex tw-gap-4 tw-rounded-b-[30px]">
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleCrop} variant="contained" startIcon={<Crop />}>
          Обрезать
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageCropper;
