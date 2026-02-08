import { usePuzzleStore } from "../../store/puzzleStore";
import { InputModeToggle } from "./InputModeToggle";
import { GridSizeControl } from "./GridSizeControl";
import { HintEditor } from "./HintEditor";
import { Grid } from "./Grid";
import { ActionButtons } from "./ActionButtons";
import { ResultDisplay } from "../result/ResultDisplay";

export function PuzzleTab() {
  const inputMode = usePuzzleStore((s) => s.inputMode);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-6">
        <InputModeToggle />
        <GridSizeControl />
      </div>

      {/* Main content area */}
      <div className="flex gap-6">
        {/* Grid */}
        <div className="overflow-auto">
          <Grid interactive={inputMode === "visual"} />
          {inputMode === "visual" && (
            <p className="text-xs text-gray-500 mt-2">
              クリック/ドラッグでマスを塗る・消す
            </p>
          )}
        </div>

        {/* Hint editor (visible in hint input mode) */}
        {inputMode === "hint" && (
          <div className="w-56 shrink-0">
            <HintEditor />
          </div>
        )}
      </div>

      {/* Action buttons */}
      <ActionButtons />

      {/* Result display */}
      <ResultDisplay />
    </div>
  );
}
