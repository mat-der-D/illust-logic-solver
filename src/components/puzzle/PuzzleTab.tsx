import { GridSizeControl } from "./GridSizeControl";
import { HintEditor } from "./HintEditor";
import { Grid } from "./Grid";
import { ActionButtons } from "./ActionButtons";
import { ResultDisplay } from "../result/ResultDisplay";

export function PuzzleTab() {
  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-6">
        <GridSizeControl />
      </div>

      {/* Main content area */}
      <div className="flex gap-6">
        {/* Grid */}
        <div className="overflow-auto">
          <Grid />
          <p className="text-xs text-gray-500 mt-2">
            クリック/ドラッグでマスを塗る・消す
          </p>
        </div>

        {/* Hint editor */}
        <div className="w-56 shrink-0">
          <HintEditor />
        </div>
      </div>

      {/* Action buttons */}
      <ActionButtons />

      {/* Result display */}
      <ResultDisplay />
    </div>
  );
}
