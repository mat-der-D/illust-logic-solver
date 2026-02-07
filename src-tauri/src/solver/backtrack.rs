use std::time::Instant;

use super::logical_solver::logical_solve;
use super::types::{CellState, Grid};

/// Find solutions using backtracking with logical deduction.
/// Stops after finding `max_solutions` solutions.
/// Returns (solutions_found, timed_out).
pub fn backtrack_solve(
    grid: &Grid,
    row_hints: &[Vec<u32>],
    col_hints: &[Vec<u32>],
    max_solutions: usize,
    deadline: Option<Instant>,
) -> (Vec<Grid>, bool) {
    let mut solutions = Vec::new();
    let mut timed_out = false;
    backtrack_recursive(
        grid.clone(),
        row_hints,
        col_hints,
        max_solutions,
        deadline,
        &mut solutions,
        &mut timed_out,
    );
    (solutions, timed_out)
}

fn backtrack_recursive(
    mut grid: Grid,
    row_hints: &[Vec<u32>],
    col_hints: &[Vec<u32>],
    max_solutions: usize,
    deadline: Option<Instant>,
    solutions: &mut Vec<Grid>,
    timed_out: &mut bool,
) {
    // Check timeout
    if let Some(dl) = deadline {
        if Instant::now() >= dl {
            *timed_out = true;
            return;
        }
    }

    if solutions.len() >= max_solutions {
        return;
    }

    // Apply logical deduction
    match logical_solve(&mut grid, row_hints, col_hints, deadline) {
        Err(()) => return, // Contradiction
        Ok(true) => {
            // Fully solved
            solutions.push(grid);
            return;
        }
        Ok(false) => {
            // Check timeout after logical solve
            if let Some(dl) = deadline {
                if Instant::now() >= dl {
                    *timed_out = true;
                    return;
                }
            }
        }
    }

    // Find the first Unknown cell
    let (row, col) = match find_unknown_cell(&grid) {
        Some(pos) => pos,
        None => return,
    };

    // Try Filled first
    let mut grid_filled = grid.clone();
    grid_filled[row][col] = CellState::Filled;
    backtrack_recursive(
        grid_filled,
        row_hints,
        col_hints,
        max_solutions,
        deadline,
        solutions,
        timed_out,
    );

    if solutions.len() >= max_solutions || *timed_out {
        return;
    }

    // Try Empty
    grid[row][col] = CellState::Empty;
    backtrack_recursive(
        grid,
        row_hints,
        col_hints,
        max_solutions,
        deadline,
        solutions,
        timed_out,
    );
}

fn find_unknown_cell(grid: &Grid) -> Option<(usize, usize)> {
    for (r, row) in grid.iter().enumerate() {
        for (c, cell) in row.iter().enumerate() {
            if *cell == CellState::Unknown {
                return Some((r, c));
            }
        }
    }
    None
}
