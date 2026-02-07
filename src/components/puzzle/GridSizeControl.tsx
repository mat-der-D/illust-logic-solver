import { useState } from "react";
import { usePuzzleStore } from "../../store/puzzleStore";

export function GridSizeControl() {
  const width = usePuzzleStore((s) => s.width);
  const height = usePuzzleStore((s) => s.height);
  const resizeGrid = usePuzzleStore((s) => s.resizeGrid);
  const settings = usePuzzleStore((s) => s.settings);

  const [newWidth, setNewWidth] = useState(width);
  const [newHeight, setNewHeight] = useState(height);

  const handleResize = () => {
    const w = Math.max(1, Math.min(settings.maxGridSize, newWidth));
    const h = Math.max(1, Math.min(settings.maxGridSize, newHeight));
    setNewWidth(w);
    setNewHeight(h);
    resizeGrid(w, h);
  };

  const showWarning =
    settings.showSizeWarning && (newWidth > 50 || newHeight > 50);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">グリッドサイズ:</span>
        <span className="text-sm text-gray-500">幅</span>
        <input
          type="number"
          min={1}
          max={settings.maxGridSize}
          value={newWidth}
          onChange={(e) => setNewWidth(Number(e.target.value))}
          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
        />
        <span className="text-sm text-gray-500">x 高さ</span>
        <input
          type="number"
          min={1}
          max={settings.maxGridSize}
          value={newHeight}
          onChange={(e) => setNewHeight(Number(e.target.value))}
          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
        />
        <button
          onClick={handleResize}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
        >
          サイズ変更
        </button>
      </div>
      {showWarning && (
        <p className="text-xs text-amber-600">
          推奨サイズ（50x50）を超えています。解答に時間がかかる可能性があります。
        </p>
      )}
    </div>
  );
}
