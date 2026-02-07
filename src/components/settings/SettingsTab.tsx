import { usePuzzleStore } from "../../store/puzzleStore";
import type { GridLineThickness, CellSizeOption } from "../../types/puzzle";

export function SettingsTab() {
  const settings = usePuzzleStore((s) => s.settings);
  const updateSettings = usePuzzleStore((s) => s.updateSettings);
  const resetSettings = usePuzzleStore((s) => s.resetSettings);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Solver settings */}
      <section className="bg-white p-4 rounded-lg border border-gray-200">
        <h2 className="text-base font-semibold text-gray-800 mb-4">
          ソルバー設定
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700">タイムアウト時間</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={10}
                max={300}
                step={10}
                value={settings.timeoutSeconds}
                onChange={(e) =>
                  updateSettings({ timeoutSeconds: Number(e.target.value) })
                }
                className="w-32"
              />
              <span className="text-sm text-gray-600 w-14 text-right">
                {settings.timeoutSeconds}秒
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700">
              最大グリッドサイズ
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={10}
                max={100}
                value={settings.maxGridSize}
                onChange={(e) =>
                  updateSettings({
                    maxGridSize: Math.max(
                      10,
                      Math.min(100, Number(e.target.value))
                    ),
                  })
                }
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
              />
              <span className="text-sm text-gray-500">x</span>
              <input
                type="number"
                min={10}
                max={100}
                value={settings.maxGridSize}
                onChange={(e) =>
                  updateSettings({
                    maxGridSize: Math.max(
                      10,
                      Math.min(100, Number(e.target.value))
                    ),
                  })
                }
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700">
              推奨サイズ警告を表示
            </label>
            <input
              type="checkbox"
              checked={settings.showSizeWarning}
              onChange={(e) =>
                updateSettings({ showSizeWarning: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
          </div>
        </div>
      </section>

      {/* Display settings */}
      <section className="bg-white p-4 rounded-lg border border-gray-200">
        <h2 className="text-base font-semibold text-gray-800 mb-4">
          表示設定
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700">
              グリッドの線の太さ
            </label>
            <select
              value={settings.gridLineThickness}
              onChange={(e) =>
                updateSettings({
                  gridLineThickness: e.target.value as GridLineThickness,
                })
              }
              className="px-2 py-1 text-sm border border-gray-300 rounded"
            >
              <option value="thin">細い</option>
              <option value="normal">標準</option>
              <option value="thick">太い</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700">セルのサイズ</label>
            <select
              value={settings.cellSize}
              onChange={(e) =>
                updateSettings({
                  cellSize: e.target.value as CellSizeOption,
                })
              }
              className="px-2 py-1 text-sm border border-gray-300 rounded"
            >
              <option value="small">小</option>
              <option value="medium">中</option>
              <option value="large">大</option>
            </select>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={resetSettings}
          className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
        >
          デフォルトに戻す
        </button>
      </div>
    </div>
  );
}
