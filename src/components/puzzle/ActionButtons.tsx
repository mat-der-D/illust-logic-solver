import { usePuzzleStore } from "../../store/puzzleStore";
import * as api from "../../lib/tauriApi";
import { openPuzzleDialog, savePuzzleDialog } from "../../lib/fileIO";
import type { PuzzleData } from "../../types/puzzle";

export function ActionButtons() {
  const store = usePuzzleStore();

  const handleLoadFile = async () => {
    try {
      const puzzle = await openPuzzleDialog();
      if (puzzle) {
        store.loadPuzzle(
          puzzle.width,
          puzzle.height,
          puzzle.rowHints,
          puzzle.colHints
        );
      }
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  const handleSaveFile = async () => {
    const puzzleData: PuzzleData = {
      version: "1.0",
      width: store.width,
      height: store.height,
      rowHints: store.rowHints,
      colHints: store.colHints,
      metadata: {
        createdAt: new Date().toISOString(),
      },
    };
    try {
      await savePuzzleDialog(puzzleData);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleSolve = async () => {
    store.setIsSolving(true);
    store.setSolveResult(null);
    store.setSolveTime(null);
    const start = performance.now();
    try {
      const result = await api.solvePuzzle(
        store.rowHints,
        store.colHints,
        store.settings.timeoutSeconds
      );
      const elapsed = (performance.now() - start) / 1000;
      store.setSolveResult(result);
      store.setSolveTime(elapsed);
    } catch (err) {
      console.error("Solve error:", err);
    } finally {
      store.setIsSolving(false);
    }
  };

  const handleGenerateHints = async () => {
    try {
      const [rowHints, colHints] = await api.generateHints(
        store.grid.map((r) => r.map(Number))
      );
      store.setRowHints(rowHints);
      store.setColHints(colHints);
    } catch (err) {
      console.error("Generate hints error:", err);
    }
  };

  const handleClear = () => {
    store.clearGrid();
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handleLoadFile}
        disabled={store.isSolving}
        className="px-4 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        ファイル読込
      </button>
      <button
        onClick={handleSaveFile}
        disabled={store.isSolving}
        className="px-4 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        ファイル保存
      </button>
      <div className="w-px bg-gray-300" />
      <button
        onClick={handleGenerateHints}
        disabled={store.isSolving}
        className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 transition-colors"
      >
        ヒント生成
      </button>
      <button
        onClick={handleSolve}
        disabled={store.isSolving}
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {store.isSolving ? "計算中..." : "解答を開始"}
      </button>
      <button
        onClick={handleClear}
        disabled={store.isSolving}
        className="px-4 py-2 text-sm bg-red-100 text-red-700 border border-red-300 rounded hover:bg-red-200 disabled:opacity-50 transition-colors"
      >
        クリア
      </button>
    </div>
  );
}
