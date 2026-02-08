import { usePuzzleStore } from "../../store/puzzleStore";

function parseHintString(s: string): number[] {
  if (s.trim() === "") return [];
  return s
    .split(",")
    .map((v) => parseInt(v.trim(), 10))
    .filter((v) => !isNaN(v) && v >= 0);
}

function hintToString(hint: number[]): string {
  return hint.join(", ");
}

export function HintEditor() {
  const rowHints = usePuzzleStore((s) => s.rowHints);
  const colHints = usePuzzleStore((s) => s.colHints);
  const setRowHint = usePuzzleStore((s) => s.setRowHint);
  const setColHint = usePuzzleStore((s) => s.setColHint);

  return (
    <div className="flex flex-row gap-6 text-sm h-full">
      <div className="flex flex-col min-h-0">
        <h3 className="font-medium text-gray-700 mb-2 shrink-0">列ヒント</h3>
        <div className="flex flex-col gap-1 overflow-y-auto min-h-0 flex-1">
          {colHints.map((hint, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-xs text-gray-400 w-6 text-right">
                {i + 1}:
              </span>
              <input
                type="text"
                value={hintToString(hint)}
                onChange={(e) => setColHint(i, parseHintString(e.target.value))}
                placeholder="例: 2, 1, 3"
                className="flex-1 px-2 py-0.5 border border-gray-300 rounded text-xs"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col min-h-0">
        <h3 className="font-medium text-gray-700 mb-2 shrink-0">行ヒント</h3>
        <div className="flex flex-col gap-1 overflow-y-auto min-h-0 flex-1">
          {rowHints.map((hint, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-xs text-gray-400 w-6 text-right">
                {i + 1}:
              </span>
              <input
                type="text"
                value={hintToString(hint)}
                onChange={(e) => setRowHint(i, parseHintString(e.target.value))}
                placeholder="例: 2, 1, 3"
                className="flex-1 px-2 py-0.5 border border-gray-300 rounded text-xs"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
