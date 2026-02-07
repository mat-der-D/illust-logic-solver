import { usePuzzleStore } from "../../store/puzzleStore";
import type { CellSizeOption, GridLineThickness } from "../../types/puzzle";

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

interface SolutionGridProps {
  grid: number[][];
}

export function SolutionGrid({ grid }: SolutionGridProps) {
  const settings = usePuzzleStore((s) => s.settings);
  const rowHints = usePuzzleStore((s) => s.rowHints);
  const colHints = usePuzzleStore((s) => s.colHints);

  const cellSize = CELL_SIZES[settings.cellSize];
  const lineWidth = LINE_WIDTHS[settings.gridLineThickness];
  const height = grid.length;
  const width = height > 0 ? grid[0].length : 0;

  const maxRowHintLen = Math.max(1, ...rowHints.map((h) => h.length));
  const maxColHintLen = Math.max(1, ...colHints.map((h) => h.length));
  const hintCellSize = Math.max(16, cellSize - 4);

  return (
    <div className="inline-block select-none">
      <table className="border-collapse" style={{ borderWidth: lineWidth }}>
        <thead>
          {Array.from({ length: maxColHintLen }, (_, hintRow) => (
            <tr key={`ch-${hintRow}`}>
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
                    className="text-center text-xs text-gray-600"
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
              <td
                className="text-right pr-1 text-xs text-gray-600 whitespace-nowrap"
                style={{
                  width: maxRowHintLen * hintCellSize,
                  minWidth: maxRowHintLen * hintCellSize,
                }}
              >
                {(rowHints[row] ?? []).join(" ")}
              </td>
              {Array.from({ length: width }, (_, col) => {
                const value = grid[row]?.[col] ?? 0;
                const isMajorRight = (col + 1) % 5 === 0 && col + 1 < width;
                const isMajorBottom =
                  (row + 1) % 5 === 0 && row + 1 < height;

                return (
                  <td
                    key={col}
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
