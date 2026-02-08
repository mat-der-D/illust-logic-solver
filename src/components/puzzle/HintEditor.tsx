import { useEffect, useState } from "react";
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

interface HintInputProps {
  hint: number[];
  onChange: (parsed: number[]) => void;
  className?: string;
  placeholder?: string;
}

function HintInput({ hint, onChange, className, placeholder }: HintInputProps) {
  const [value, setValue] = useState(() => hintToString(hint));

  // Sync when hint changes externally (e.g. file load, grid resize)
  useEffect(() => {
    setValue(hintToString(hint));
  }, [hint]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onChange(parseHintString(value))}
      placeholder={placeholder}
      className={className}
    />
  );
}

export function HintEditor() {
  const rowHints = usePuzzleStore((s) => s.rowHints);
  const colHints = usePuzzleStore((s) => s.colHints);
  const setRowHint = usePuzzleStore((s) => s.setRowHint);
  const setColHint = usePuzzleStore((s) => s.setColHint);

  return (
    <div className="flex flex-row gap-4 text-sm h-full">
      <div className="flex flex-col min-h-0 bg-amber-50 rounded-lg p-2">
        <h3 className="font-medium text-amber-700 mb-2 shrink-0">行ヒント</h3>
        <div className="flex flex-col gap-1 overflow-y-auto min-h-0 flex-1">
          {rowHints.map((hint, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-xs text-amber-600 w-6 text-right">
                {i + 1}:
              </span>
              <HintInput
                hint={hint}
                onChange={(parsed) => setRowHint(i, parsed)}
                placeholder="例: 2, 1, 3"
                className="flex-1 px-2 py-0.5 border border-amber-200 rounded text-xs bg-white"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col min-h-0 bg-blue-50 rounded-lg p-2">
        <h3 className="font-medium text-blue-700 mb-2 shrink-0">列ヒント</h3>
        <div className="flex flex-col gap-1 overflow-y-auto min-h-0 flex-1">
          {colHints.map((hint, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-xs text-blue-600 w-6 text-right">
                {i + 1}:
              </span>
              <HintInput
                hint={hint}
                onChange={(parsed) => setColHint(i, parsed)}
                placeholder="例: 2, 1, 3"
                className="flex-1 px-2 py-0.5 border border-blue-200 rounded text-xs bg-white"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
