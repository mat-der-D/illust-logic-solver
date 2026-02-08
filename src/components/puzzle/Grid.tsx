import { useCallback } from "react";
import { usePuzzleStore } from "../../store/puzzleStore";
import { useGridInteraction } from "../../hooks/useGridInteraction";
import type { CellValue, CellSizeOption, GridLineThickness } from "../../types/puzzle";

const CELL_SIZES: Record<CellSizeOption, number> = {
  small: 18,
  medium: 24,
  large: 32,
};

const LINE_WIDTHS: Record<GridLineThickness, number> = {
  thin: 1,
  normal: 2,
  thick: 3,
};

interface GridProps {
  gridData?: number[][];
}

export function Grid({ gridData }: GridProps) {
  const grid = usePuzzleStore((s) => s.grid);
  const rowHints = usePuzzleStore((s) => s.rowHints);
  const colHints = usePuzzleStore((s) => s.colHints);
  const width = usePuzzleStore((s) => s.width);
  const height = usePuzzleStore((s) => s.height);
  const settings = usePuzzleStore((s) => s.settings);
  const setCellValue = usePuzzleStore((s) => s.setCellValue);

  const displayGrid = gridData ?? grid;
  const cellSize = CELL_SIZES[settings.cellSize];
  const lineWidth = LINE_WIDTHS[settings.gridLineThickness];

  const onCellChange = useCallback(
    (row: number, col: number, action: "fill" | "clear") => {
      setCellValue(row, col, (action === "fill" ? 1 : 0) as CellValue);
    },
    [setCellValue]
  );

  const { handleMouseDown, handleMouseEnter } = useGridInteraction(onCellChange);

  // Calculate max hint lengths for sizing
  const maxRowHintLen = Math.max(1, ...rowHints.map((h) => h.length));
  const maxColHintLen = Math.max(1, ...colHints.map((h) => h.length));

  const hintCellSize = Math.max(16, cellSize - 4);

  return (
    <div className="inline-block select-none">
      <table
        className="border-collapse"
        style={{ borderWidth: lineWidth }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <thead>
          {/* Column hints */}
          {Array.from({ length: maxColHintLen }, (_, hintRow) => (
            <tr key={`ch-${hintRow}`}>
              {/* Empty corner */}
              {hintRow === 0 && (
                <td
                  rowSpan={maxColHintLen}
                  style={{
                    width: maxRowHintLen * hintCellSize,
                    minWidth: maxRowHintLen * hintCellSize,
                  }}
                />
              )}
              {Array.from({ length: width }, (_, col) => {
                const hints = colHints[col] ?? [];
                const offset = maxColHintLen - hints.length;
                const hintIdx = hintRow - offset;
                return (
                  <td
                    key={col}
                    className="text-center text-xs text-blue-700 bg-blue-50"
                    style={{
                      width: cellSize,
                      height: hintCellSize,
                      minWidth: cellSize,
                    }}
                  >
                    {hintIdx >= 0 && hintIdx < hints.length
                      ? hints[hintIdx]
                      : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {Array.from({ length: height }, (_, row) => (
            <tr key={row}>
              {/* Row hints */}
              <td
                className="text-right pr-1 text-xs text-amber-700 bg-amber-50 whitespace-nowrap"
                style={{
                  width: maxRowHintLen * hintCellSize,
                  minWidth: maxRowHintLen * hintCellSize,
                }}
              >
                {(rowHints[row] ?? []).join(" ")}
              </td>
              {/* Grid cells */}
              {Array.from({ length: width }, (_, col) => {
                const value = displayGrid[row]?.[col] ?? 0;
                const isMajorRight = (col + 1) % 5 === 0 && col + 1 < width;
                const isMajorBottom = (row + 1) % 5 === 0 && row + 1 < height;

                return (
                  <td
                    key={col}
                    className="transition-colors cursor-pointer"
                    style={{
                      width: cellSize,
                      height: cellSize,
                      minWidth: cellSize,
                      minHeight: cellSize,
                      backgroundColor: value === 1 ? "#1f2937" : "#ffffff",
                      borderTop: `${lineWidth}px solid #9ca3af`,
                      borderLeft: `${lineWidth}px solid #9ca3af`,
                      borderRight: isMajorRight
                        ? `${lineWidth + 1}px solid #374151`
                        : `${lineWidth}px solid #9ca3af`,
                      borderBottom: isMajorBottom
                        ? `${lineWidth + 1}px solid #374151`
                        : `${lineWidth}px solid #9ca3af`,
                    }}
                    onMouseDown={() => handleMouseDown(row, col, value)}
                    onMouseEnter={() => handleMouseEnter(row, col)}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
