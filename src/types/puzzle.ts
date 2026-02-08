export type CellValue = 0 | 1;

export type GridLineThickness = "thin" | "normal" | "thick";
export type CellSizeOption = "small" | "medium" | "large";

export interface PuzzleData {
  version: string;
  width: number;
  height: number;
  rowHints: number[][];
  colHints: number[][];
  metadata?: PuzzleMetadata;
}

export interface PuzzleMetadata {
  title?: string;
  author?: string;
  difficulty?: string;
  createdAt?: string;
}

export type SolveResult =
  | { type: "UniqueSolution"; grid: number[][] }
  | { type: "MultipleSolutions" }
  | { type: "NoSolution" }
  | { type: "Timeout"; elapsed_seconds: number };

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface AppSettings {
  timeoutSeconds: number;
  maxGridSize: number;
  showSizeWarning: boolean;
  gridLineThickness: GridLineThickness;
  cellSize: CellSizeOption;
}
