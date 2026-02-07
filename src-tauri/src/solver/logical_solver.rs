use std::time::Instant;

use super::line_solver::solve_line;
use super::types::{CellState, Grid};

/// Apply iterative logical deduction to the grid.
/// Returns Ok(true) if grid is fully solved, Ok(false) if unsolved cells remain,
/// Err(()) if a contradiction is found.
pub fn logical_solve(
    grid: &mut Grid,
    row_hints: &[Vec<u32>],
    col_hints: &[Vec<u32>],
    deadline: Option<Instant>,
) -> Result<bool, ()> {
    let height = grid.len();
    let width = if height > 0 { grid[0].len() } else { return Ok(true) };
    let mut changed = true;

    while changed {
        changed = false;

        if let Some(dl) = deadline {
            if Instant::now() >= dl {
                return Ok(false);
            }
        }

        // Process each row
        for row in 0..height {
            let new_row = solve_line(&grid[row], &row_hints[row]);
            match new_row {
                None => return Err(()),
                Some(new) => {
                    if new != grid[row] {
                        grid[row] = new;
                        changed = true;
                    }
                }
            }
        }

        // Process each column
        for col in 0..width {
            let col_data: Vec<CellState> = (0..height).map(|r| grid[r][col]).collect();
            let new_col = solve_line(&col_data, &col_hints[col]);
            match new_col {
                None => return Err(()),
                Some(new) => {
                    if new != col_data {
                        for r in 0..height {
                            grid[r][col] = new[r];
                        }
                        changed = true;
                    }
                }
            }
        }
    }

    let fully_solved = grid
        .iter()
        .all(|row| row.iter().all(|c| *c != CellState::Unknown));
    Ok(fully_solved)
}
