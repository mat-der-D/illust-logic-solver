use std::time::{Duration, Instant};

use crate::puzzle::{data::PuzzleData, file_io, hint_generator};
use crate::solver::{
    backtrack::backtrack_solve,
    types::{CellState, Grid, SolveResult, ValidationResult},
    validator::validate_puzzle,
};

fn grid_to_u8(grid: &Grid) -> Vec<Vec<u8>> {
    grid.iter()
        .map(|row| {
            row.iter()
                .map(|c| match c {
                    CellState::Filled => 1,
                    _ => 0,
                })
                .collect()
        })
        .collect()
}

#[tauri::command]
pub fn solve_puzzle(
    row_hints: Vec<Vec<u32>>,
    col_hints: Vec<Vec<u32>>,
    timeout_seconds: Option<u64>,
) -> SolveResult {
    let timeout = timeout_seconds.unwrap_or(60);
    let deadline = Instant::now() + Duration::from_secs(timeout);

    let height = row_hints.len();
    let width = col_hints.len();
    let grid: Grid = vec![vec![CellState::Unknown; width]; height];

    let (solutions, timed_out) =
        backtrack_solve(&grid, &row_hints, &col_hints, 2, Some(deadline));

    if timed_out && solutions.is_empty() {
        return SolveResult::Timeout {
            elapsed_seconds: timeout as f64,
        };
    }

    match solutions.len() {
        0 => SolveResult::NoSolution,
        1 => SolveResult::UniqueSolution {
            grid: grid_to_u8(&solutions[0]),
        },
        _ => SolveResult::MultipleSolutions,
    }
}

#[tauri::command]
pub fn generate_hints_command(grid: Vec<Vec<u8>>) -> (Vec<Vec<u32>>, Vec<Vec<u32>>) {
    hint_generator::generate_hints(&grid)
}

#[tauri::command]
pub fn validate_puzzle_command(
    width: usize,
    height: usize,
    row_hints: Vec<Vec<u32>>,
    col_hints: Vec<Vec<u32>>,
) -> ValidationResult {
    validate_puzzle(width, height, &row_hints, &col_hints)
}

#[tauri::command]
pub fn load_puzzle_file_command(path: String) -> Result<PuzzleData, String> {
    file_io::load_puzzle_file(std::path::Path::new(&path))
}

#[tauri::command]
pub fn save_puzzle_file_command(path: String, puzzle_data: PuzzleData) -> Result<(), String> {
    file_io::save_puzzle_file(std::path::Path::new(&path), &puzzle_data)
}
