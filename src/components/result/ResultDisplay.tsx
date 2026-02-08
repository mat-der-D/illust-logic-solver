import { usePuzzleStore } from "../../store/puzzleStore";
import { SolutionGrid } from "./SolutionGrid";

export function ResultDisplay() {
  const solveResult = usePuzzleStore((s) => s.solveResult);
  const solveTime = usePuzzleStore((s) => s.solveTime);

  if (!solveResult) return null;

  const timeText =
    solveTime !== null ? `計算時間: ${solveTime.toFixed(2)}秒` : "";

  switch (solveResult.type) {
    case "UniqueSolution":
      return (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-green-600 text-lg font-bold">&#10003;</span>
            <h3 className="text-green-800 font-medium">
              一意解が見つかりました
            </h3>
          </div>
          <div className="mb-3 overflow-auto">
            <SolutionGrid grid={solveResult.grid} />
          </div>
          {timeText && (
            <p className="text-sm text-green-700">{timeText}</p>
          )}
        </div>
      );

    case "MultipleSolutions":
      return (
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-600 text-lg font-bold">&#9888;</span>
            <h3 className="text-amber-800 font-medium">
              この問題には複数の解が存在します
            </h3>
          </div>
          <p className="text-sm text-amber-700 mb-3">
            この問題は一意解を持たないため、パズルとして適切ではありません。
          </p>
          <div className="flex flex-wrap gap-4">
            {solveResult.grids.map((grid, i) => (
              <div key={i} className="mb-3">
                <p className="text-sm text-amber-800 font-medium mb-1">
                  解 {i + 1}
                </p>
                <div className="overflow-auto">
                  <SolutionGrid grid={grid} />
                </div>
              </div>
            ))}
          </div>
          {timeText && (
            <p className="text-sm text-amber-700">{timeText}</p>
          )}
        </div>
      );

    case "NoSolution":
      return (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-600 text-lg font-bold">&#10007;</span>
            <h3 className="text-red-800 font-medium">
              この問題には解が存在しません
            </h3>
          </div>
          <p className="text-sm text-red-700 mb-2">
            ヒントに矛盾があるため、解答不可能な問題です。
          </p>
          {timeText && (
            <p className="text-sm text-red-700">{timeText}</p>
          )}
        </div>
      );

    case "Timeout":
      return (
        <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-600 text-lg font-bold">&#9201;</span>
            <h3 className="text-gray-800 font-medium">
              解答に時間がかかりすぎています
            </h3>
          </div>
          <p className="text-sm text-gray-700 mb-2">
            この問題は複雑すぎるため、制限時間内に解答できませんでした。
          </p>
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">対処方法:</p>
            <ul className="list-disc list-inside">
              <li>問題サイズを小さくする</li>
              <li>設定でタイムアウト時間を延長する</li>
            </ul>
          </div>
        </div>
      );
  }
}
