import { usePuzzleStore } from "../../store/puzzleStore";

export function TabBar() {
  const activeTab = usePuzzleStore((s) => s.activeTab);
  const setActiveTab = usePuzzleStore((s) => s.setActiveTab);

  const tabs = [
    { key: "puzzle" as const, label: "パズル" },
    { key: "settings" as const, label: "設定" },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <nav className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
