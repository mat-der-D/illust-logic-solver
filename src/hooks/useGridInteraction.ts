import { useState, useCallback, useEffect } from "react";

type DragAction = "fill" | "clear" | null;

export function useGridInteraction(
  onCellChange: (row: number, col: number, action: "fill" | "clear") => void
) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragAction, setDragAction] = useState<DragAction>(null);

  const handleMouseDown = useCallback(
    (row: number, col: number, currentValue: number) => {
      const action = currentValue === 1 ? "clear" : "fill";
      setIsDragging(true);
      setDragAction(action);
      onCellChange(row, col, action);
    },
    [onCellChange]
  );

  const handleMouseEnter = useCallback(
    (row: number, col: number) => {
      if (isDragging && dragAction) {
        onCellChange(row, col, dragAction);
      }
    },
    [isDragging, dragAction, onCellChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragAction(null);
  }, []);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseUp]);

  return { handleMouseDown, handleMouseEnter };
}
