import { create } from "zustand";
import type {
  InputMode,
  CellValue,
  SolveResult,
  AppSettings,
} from "../types/puzzle";

interface PuzzleState {
  width: number;
  height: number;
  inputMode: InputMode;
  grid: CellValue[][];
  rowHints: number[][];
  colHints: number[][];
  isSolving: boolean;
  solveResult: SolveResult | null;
  solveTime: number | null;
  settings: AppSettings;
  activeTab: "puzzle" | "settings";

  setInputMode: (mode: InputMode) => void;
  setGrid: (grid: CellValue[][]) => void;
  setCellValue: (row: number, col: number, value: CellValue) => void;
  setRowHints: (hints: number[][]) => void;
  setColHints: (hints: number[][]) => void;
  setRowHint: (index: number, hint: number[]) => void;
  setColHint: (index: number, hint: number[]) => void;
  resizeGrid: (w: number, h: number) => void;
  clearGrid: () => void;
  setIsSolving: (v: boolean) => void;
  setSolveResult: (r: SolveResult | null) => void;
  setSolveTime: (t: number | null) => void;
  setActiveTab: (tab: "puzzle" | "settings") => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetSettings: () => void;
  loadPuzzle: (
    width: number,
    height: number,
    rowHints: number[][],
    colHints: number[][]
  ) => void;
}

const DEFAULT_SIZE = 10;

const defaultSettings: AppSettings = {
  timeoutSeconds: 60,
  maxGridSize: 100,
  showSizeWarning: true,
  gridLineThickness: "normal",
  cellSize: "medium",
};

function createEmptyGrid(w: number, h: number): CellValue[][] {
  return Array.from({ length: h }, () => Array<CellValue>(w).fill(0));
}

function createEmptyHints(count: number): number[][] {
  return Array.from({ length: count }, () => []);
}

export const usePuzzleStore = create<PuzzleState>((set) => ({
  width: DEFAULT_SIZE,
  height: DEFAULT_SIZE,
  inputMode: "hint",
  grid: createEmptyGrid(DEFAULT_SIZE, DEFAULT_SIZE),
  rowHints: createEmptyHints(DEFAULT_SIZE),
  colHints: createEmptyHints(DEFAULT_SIZE),
  isSolving: false,
  solveResult: null,
  solveTime: null,
  settings: { ...defaultSettings },
  activeTab: "puzzle",

  setInputMode: (mode) => set({ inputMode: mode }),
  setGrid: (grid) => set({ grid }),
  setCellValue: (row, col, value) =>
    set((state) => {
      const newGrid = state.grid.map((r) => [...r]);
      newGrid[row][col] = value;
      return { grid: newGrid };
    }),
  setRowHints: (hints) => set({ rowHints: hints }),
  setColHints: (hints) => set({ colHints: hints }),
  setRowHint: (index, hint) =>
    set((state) => {
      const newHints = [...state.rowHints];
      newHints[index] = hint;
      return { rowHints: newHints };
    }),
  setColHint: (index, hint) =>
    set((state) => {
      const newHints = [...state.colHints];
      newHints[index] = hint;
      return { colHints: newHints };
    }),
  resizeGrid: (w, h) =>
    set({
      width: w,
      height: h,
      grid: createEmptyGrid(w, h),
      rowHints: createEmptyHints(h),
      colHints: createEmptyHints(w),
      solveResult: null,
      solveTime: null,
    }),
  clearGrid: () =>
    set((state) => ({
      grid: createEmptyGrid(state.width, state.height),
      rowHints: createEmptyHints(state.height),
      colHints: createEmptyHints(state.width),
      solveResult: null,
      solveTime: null,
    })),
  setIsSolving: (v) => set({ isSolving: v }),
  setSolveResult: (r) => set({ solveResult: r }),
  setSolveTime: (t) => set({ solveTime: t }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  updateSettings: (partial) =>
    set((state) => ({
      settings: { ...state.settings, ...partial },
    })),
  resetSettings: () => set({ settings: { ...defaultSettings } }),
  loadPuzzle: (width, height, rowHints, colHints) =>
    set({
      width,
      height,
      rowHints,
      colHints,
      grid: createEmptyGrid(width, height),
      solveResult: null,
      solveTime: null,
      inputMode: "hint",
    }),
}));
