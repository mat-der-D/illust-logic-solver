import { invoke } from "@tauri-apps/api/core";
import type {
  SolveResult,
  ValidationResult,
  PuzzleData,
} from "../types/puzzle";

export async function solvePuzzle(
  rowHints: number[][],
  colHints: number[][],
  timeoutSeconds?: number
): Promise<SolveResult> {
  return await invoke<SolveResult>("solve_puzzle", {
    rowHints,
    colHints,
    timeoutSeconds: timeoutSeconds ?? null,
  });
}

export async function checkUniqueness(
  rowHints: number[][],
  colHints: number[][],
  timeoutSeconds?: number
): Promise<SolveResult> {
  return await invoke<SolveResult>("check_uniqueness", {
    rowHints,
    colHints,
    timeoutSeconds: timeoutSeconds ?? null,
  });
}

export async function generateHints(
  grid: number[][]
): Promise<[number[][], number[][]]> {
  return await invoke<[number[][], number[][]]>("generate_hints_command", {
    grid,
  });
}

export async function validatePuzzle(
  width: number,
  height: number,
  rowHints: number[][],
  colHints: number[][]
): Promise<ValidationResult> {
  return await invoke<ValidationResult>("validate_puzzle_command", {
    width,
    height,
    rowHints,
    colHints,
  });
}

export async function loadPuzzleFile(path: string): Promise<PuzzleData> {
  return await invoke<PuzzleData>("load_puzzle_file_command", { path });
}

export async function savePuzzleFile(
  path: string,
  puzzleData: PuzzleData
): Promise<void> {
  return await invoke<void>("save_puzzle_file_command", { path, puzzleData });
}
