import { useState, useRef, useEffect, useCallback } from "react";

// Глобальное состояние для контроля курсора и активного компонента
const globalResizeState = {
  activeId: null,
  setActiveId: (id) => {
    globalResizeState.activeId = id;
  },
  setCursor: (cursor) => {
    document.body.style.cursor = cursor;
  },
};

// Хук useResizable для создания изменяемых по размеру элементов
export function useResizable(
  id,
  initialWidth = 250,
  minWidth = 150,
  maxWidth = 600,
  resizeHandleWidth = 5
) {
  const [width, setWidth] = useState(initialWidth);
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(initialWidth);
  const elementRef = useRef(null);
  const [isResizeArea, setIsResizeArea] = useState(false);

  const checkResizeArea = useCallback(
    (e) => {
      const isCurrentElement =
        elementRef.current === e.target ||
        elementRef.current?.contains(e.target);
      if (!elementRef.current || !isCurrentElement) {
        if (globalResizeState.activeId === id) {
          globalResizeState.setActiveId(null);
          globalResizeState.setCursor("");
        }
        return;
      }

      const rect = elementRef.current.getBoundingClientRect();
      const rightEdge = rect.right;
      const isNearRightEdge =
        Math.abs(e.clientX - rightEdge) <= resizeHandleWidth;

      setIsResizeArea(isNearRightEdge);

      if (isNearRightEdge) {
        globalResizeState.setActiveId(id);
        globalResizeState.setCursor("col-resize");
      } else if (globalResizeState.activeId === id) {
        globalResizeState.setActiveId(null);
        globalResizeState.setCursor("");
      }
    },
    [id, resizeHandleWidth]
  );

  const startResizing = (e) => {
    if (!isResizeArea) return;

    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    globalResizeState.setActiveId(id);
    e.preventDefault();
  };

  const stopResizing = () => {
    if (isResizing.current) {
      isResizing.current = false;
      if (globalResizeState.activeId === id) {
        globalResizeState.setActiveId(null);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) {
      checkResizeArea(e);
      return;
    }

    const delta = e.clientX - startX.current;
    const newWidth = Math.max(
      minWidth,
      Math.min(maxWidth, startWidth.current + delta)
    );
    setWidth(newWidth);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResizing);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopResizing);
      if (globalResizeState.activeId === id) {
        globalResizeState.setActiveId(null);
        globalResizeState.setCursor("");
      }
    };
  }, [id]);

  const setRef = useCallback((el) => {
    elementRef.current = el;
  }, []);

  return { width, startResizing, isResizeArea, setRef };
}
