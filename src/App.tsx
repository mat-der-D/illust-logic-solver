import { usePuzzleStore } from "./store/puzzleStore";
import { TabBar } from "./components/layout/TabBar";
import { PuzzleTab } from "./components/puzzle/PuzzleTab";
import { SettingsTab } from "./components/settings/SettingsTab";

function App() {
  const activeTab = usePuzzleStore((s) => s.activeTab);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TabBar />
      <main className="flex-1 p-3 overflow-auto">
        {activeTab === "puzzle" ? <PuzzleTab /> : <SettingsTab />}
      </main>
    </div>
  );
}

export default App;
