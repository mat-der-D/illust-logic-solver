import { usePuzzleStore } from "../../store/puzzleStore";
import type { InputMode } from "../../types/puzzle";

export function InputModeToggle() {
  const inputMode = usePuzzleStore((s) => s.inputMode);
  const setInputMode = usePuzzleStore((s) => s.setInputMode);

  const modes: { key: InputMode; label: string }[] = [
    { key: "hint", label: "ヒント入力" },
    { key: "visual", label: "ビジュアル作成" },
  ];

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-700">入力モード:</span>
      {modes.map((mode) => (
        <label key={mode.key} className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="radio"
            name="inputMode"
            value={mode.key}
            checked={inputMode === mode.key}
            onChange={() => setInputMode(mode.key)}
            className="text-blue-600"
          />
          <span className="text-sm text-gray-700">{mode.label}</span>
        </label>
      ))}
    </div>
  );
}
