import { open, save } from "@tauri-apps/plugin-dialog";
import { loadPuzzleFile, savePuzzleFile } from "./tauriApi";
import type { PuzzleData } from "../types/puzzle";

export async function openPuzzleDialog(): Promise<PuzzleData | null> {
  const selected = await open({
    multiple: false,
    filters: [{ name: "JSON", extensions: ["json"] }],
  });

  if (!selected) return null;
  const path = typeof selected === "string" ? selected : selected;
  return await loadPuzzleFile(path);
}

export async function savePuzzleDialog(
  puzzleData: PuzzleData
): Promise<boolean> {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const defaultName = `puzzle_${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.json`;

  const filePath = await save({
    defaultPath: defaultName,
    filters: [{ name: "JSON", extensions: ["json"] }],
  });

  if (!filePath) return false;
  await savePuzzleFile(filePath, puzzleData);
  return true;
}
