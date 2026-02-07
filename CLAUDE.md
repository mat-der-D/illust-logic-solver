# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tauri 2.0 desktop application for solving Nonogram (Illustration Logic / お絵かきロジック) puzzles.

- **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + Zustand
- **Backend**: Rust solver with logical deduction + backtracking
- **Package Manager**: pnpm (version pinned in package.json)

## Development Commands

### Frontend Development
```bash
pnpm install          # Install dependencies
pnpm dev              # Run Vite dev server (frontend only)
pnpm build            # Build frontend (TypeScript + Vite)
```

### Tauri Desktop App
```bash
cd src-tauri
cargo tauri dev       # Run development app (builds Rust + launches with hot reload)
cargo tauri build     # Build production app
```

### Testing
```bash
cd src-tauri
cargo test            # Run all Rust tests
cargo test <name>     # Run specific test by name
cargo test -- --nocapture  # Show println! output in tests
```

Tests are located in `src-tauri/src/lib.rs` (integration tests) and inline with modules (unit tests).

## Architecture

### Rust Backend (`src-tauri/src/`)

The solver is organized into distinct modules:

**`solver/` - Core solving algorithms**
- `types.rs`: Core types (`CellState`, `Grid`, `SolveResult`, `ValidationResult`)
- `pattern.rs`: Pattern generation for possible line configurations (performance bottleneck)
- `line_solver.rs`: Determines which cells can be definitively filled/empty based on line constraints
- `logical_solver.rs`: Applies line solving repeatedly to all rows/columns
- `backtrack.rs`: Recursive backtracking when logical deduction stalls
- `validator.rs`: Validates puzzle constraints (hint sums, feasibility)

**`puzzle/` - Data management**
- `data.rs`: `PuzzleData` struct matching JSON format (uses `#[serde(rename_all = "camelCase")]`)
- `file_io.rs`: Load/save puzzle files via Tauri filesystem plugin
- `hint_generator.rs`: Generate hints from a completed grid (reverse operation)

**`commands.rs` - Tauri IPC handlers**
All backend functions exposed to frontend as Tauri commands:
- `solve_puzzle`: Main solver entry point (returns `SolveResult` enum, also detects multiple solutions)
- `generate_hints_command`: Convert grid to row/col hints
- `validate_puzzle_command`: Validate puzzle constraints before solving
- `load_puzzle_file_command` / `save_puzzle_file_command`: File I/O

**Solver Algorithm Flow:**
1. Logical solver attempts to fill cells using line-by-line deduction
2. If incomplete, backtracking explores remaining possibilities
3. Solver finds up to 2 solutions to distinguish unique/multiple/none
4. Timeout protection with configurable deadline (default 60s)

### Frontend (`src/`)

**State Management (Zustand)**
- `store/puzzleStore.ts`: Single global store for all app state
  - Grid dimensions, cell values, hints (row/col)
  - Input mode (`hint` vs `visual`)
  - Solving status, results, timing
  - App settings (timeout, grid size limits, UI preferences)

**Components Structure**
- `components/puzzle/`: Puzzle editing tab (Grid, HintEditor, GridSizeControl, InputModeToggle, ActionButtons)
- `components/result/`: Solution display tab (ResultDisplay, SolutionGrid)
- `components/settings/`: Settings tab
- `components/layout/`: TabBar navigation

**Tauri Integration**
- `lib/tauriApi.ts`: Typed wrappers for Tauri commands (calls `invoke()`)
- `lib/fileIO.ts`: File picker and load/save operations using Tauri dialog + fs plugins

**Types**
- `types/puzzle.ts`: TypeScript types matching Rust structs
  - `SolveResult`: Discriminated union with `type` field (matches Rust `#[serde(tag = "type")]`)
  - `PuzzleData`: Matches JSON file format and Rust struct

### Tauri 2.0 Specifics

**Plugin Registration** - Plugins must be registered in TWO places:
1. `src-tauri/src/lib.rs`: `.plugin(tauri_plugin_dialog::init())` and `.plugin(tauri_plugin_fs::init())`
2. `src-tauri/capabilities/default.json`: Permission grants for dialog and fs

**Command Registration**
All commands must be listed in `tauri::generate_handler![]` macro in `lib.rs`.

### Tailwind v4 Configuration

Uses CSS-based configuration (NOT PostCSS):
- Import via `@import "tailwindcss"` in CSS files (not `@tailwind` directives)
- Requires `@tailwindcss/vite` plugin in `vite.config.ts`
- No `tailwind.config.js` file

## Important Notes

### Sample Data Issues
**CRITICAL**: Most sample JSON files in `docs/samples/` have **inconsistent hints**:
- `easy_5x5.json`: row_sum=15, col_sum=13 (invalid)
- `medium_10x10.json`: row_sum=50, col_sum=72 (invalid)
- `backtrack_required_10x10.json`: Solution satisfies rows but not columns (invalid)

**Valid samples**: `no_solution.json`, `edge_1x1.json`, `edge_all_filled_5x5.json`, `edge_all_empty_5x5.json`

When creating new puzzles or tests:
1. Verify `row_sum == col_sum` (sum of all hints)
2. Manually verify that hints are satisfiable simultaneously
3. Use the integration tests in `lib.rs` as templates for hand-verified puzzles

### Empty Hints
Empty rows/columns should be represented as `[]` (empty array), NOT `[0]`. Both are handled by the solver.

### Performance Considerations
- Pattern generation is the bottleneck for large puzzles
- For 50+ grids, solver may need optimization (e.g., Simple Boxes algorithm)
- Timeout mechanism prevents infinite solving on complex puzzles

## File Locations

- **Documentation**: `docs/ALGORITHM.md` (solver details), `docs/SPECIFICATION.md` (full spec)
- **Sample Puzzles**: `docs/samples/*.json` (but verify before using!)
- **Project Memory**: `~/.claude/projects/.../memory/MEMORY.md` (learnings from previous sessions)
