mod commands;
mod puzzle;
mod solver;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            commands::solve_puzzle,
            commands::check_uniqueness,
            commands::generate_hints_command,
            commands::validate_puzzle_command,
            commands::load_puzzle_file_command,
            commands::save_puzzle_file_command,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod integration_tests {
    use crate::solver::backtrack::backtrack_solve;
    use crate::solver::types::CellState;
    use crate::solver::validator::validate_puzzle;

    fn grid_to_u8(grid: &[Vec<CellState>]) -> Vec<Vec<u8>> {
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

    // Cross pattern 5x5 (verified: row_sum=col_sum=9)
    //   □ □ ■ □ □
    //   □ □ ■ □ □
    //   ■ ■ ■ ■ ■
    //   □ □ ■ □ □
    //   □ □ ■ □ □
    #[test]
    fn test_cross_5x5() {
        let row_hints = vec![vec![1], vec![1], vec![5], vec![1], vec![1]];
        let col_hints = vec![vec![1], vec![1], vec![5], vec![1], vec![1]];
        let grid = vec![vec![CellState::Unknown; 5]; 5];
        let (solutions, timed_out) = backtrack_solve(&grid, &row_hints, &col_hints, 2, None);
        assert!(!timed_out);
        assert_eq!(solutions.len(), 1);

        let expected = vec![
            vec![0, 0, 1, 0, 0],
            vec![0, 0, 1, 0, 0],
            vec![1, 1, 1, 1, 1],
            vec![0, 0, 1, 0, 0],
            vec![0, 0, 1, 0, 0],
        ];
        assert_eq!(grid_to_u8(&solutions[0]), expected);
    }

    // Checkerboard-like 3x3 (verified: row_sum=col_sum=5)
    //   ■ □ ■
    //   □ ■ □
    //   ■ □ ■
    #[test]
    fn test_checker_3x3() {
        let row_hints = vec![vec![1, 1], vec![1], vec![1, 1]];
        let col_hints = vec![vec![1, 1], vec![1], vec![1, 1]];
        let grid = vec![vec![CellState::Unknown; 3]; 3];
        let (solutions, timed_out) = backtrack_solve(&grid, &row_hints, &col_hints, 2, None);
        assert!(!timed_out);
        assert_eq!(solutions.len(), 1);

        let expected = vec![vec![1, 0, 1], vec![0, 1, 0], vec![1, 0, 1]];
        assert_eq!(grid_to_u8(&solutions[0]), expected);
    }

    // Diamond/pyramid 10x10 with correct col hints
    // (verified: row_sum=col_sum=50)
    #[test]
    fn test_pyramid_10x10() {
        let row_hints: Vec<Vec<u32>> = vec![
            vec![2],
            vec![4],
            vec![6],
            vec![8],
            vec![10],
            vec![8],
            vec![6],
            vec![4],
            vec![2],
            vec![],
        ];
        // Correct col hints for this pyramid pattern
        let col_hints: Vec<Vec<u32>> = vec![
            vec![1],
            vec![3],
            vec![5],
            vec![7],
            vec![9],
            vec![9],
            vec![7],
            vec![5],
            vec![3],
            vec![1],
        ];
        let grid = vec![vec![CellState::Unknown; 10]; 10];
        let (solutions, timed_out) = backtrack_solve(&grid, &row_hints, &col_hints, 2, None);
        assert!(!timed_out);
        assert_eq!(solutions.len(), 1);

        let expected = vec![
            vec![0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
            vec![0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
            vec![0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
            vec![0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            vec![1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            vec![0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            vec![0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
            vec![0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
            vec![0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
            vec![0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        assert_eq!(grid_to_u8(&solutions[0]), expected);
    }

    // L-shape 4x4 requiring backtracking (verified: row_sum=col_sum=7)
    //   ■ □ □ □
    //   ■ □ □ □
    //   ■ □ □ □
    //   ■ ■ ■ ■
    #[test]
    fn test_l_shape_4x4() {
        let row_hints = vec![vec![1], vec![1], vec![1], vec![4]];
        let col_hints = vec![vec![4], vec![1], vec![1], vec![1]];
        let grid = vec![vec![CellState::Unknown; 4]; 4];
        let (solutions, timed_out) = backtrack_solve(&grid, &row_hints, &col_hints, 2, None);
        assert!(!timed_out);
        assert_eq!(solutions.len(), 1);
        let expected = vec![
            vec![1, 0, 0, 0],
            vec![1, 0, 0, 0],
            vec![1, 0, 0, 0],
            vec![1, 1, 1, 1],
        ];
        assert_eq!(grid_to_u8(&solutions[0]), expected);
    }

    // 6x6 frame pattern requiring some backtracking
    //   ■ ■ ■ ■ ■ ■
    //   ■ □ □ □ □ ■
    //   ■ □ □ □ □ ■
    //   ■ □ □ □ □ ■
    //   ■ □ □ □ □ ■
    //   ■ ■ ■ ■ ■ ■
    #[test]
    fn test_frame_6x6() {
        let row_hints = vec![vec![6], vec![1, 1], vec![1, 1], vec![1, 1], vec![1, 1], vec![6]];
        let col_hints = vec![vec![6], vec![1, 1], vec![1, 1], vec![1, 1], vec![1, 1], vec![6]];
        let grid = vec![vec![CellState::Unknown; 6]; 6];
        let (solutions, timed_out) = backtrack_solve(&grid, &row_hints, &col_hints, 2, None);
        assert!(!timed_out);
        assert_eq!(solutions.len(), 1);
    }

    #[test]
    fn test_no_solution() {
        // Row hints all [5], col hints all [1] - clear contradiction (25 != 5)
        let row_hints = vec![vec![5]; 5];
        let col_hints = vec![vec![1]; 5];
        let grid = vec![vec![CellState::Unknown; 5]; 5];
        let (solutions, timed_out) = backtrack_solve(&grid, &row_hints, &col_hints, 2, None);
        assert!(!timed_out);
        assert_eq!(solutions.len(), 0);
    }

    // Multiple solutions: 2x2 grid with hint [1] for all rows and cols
    //   ■ □    □ ■
    //   □ ■    ■ □
    // Both are valid
    #[test]
    fn test_multiple_solutions_2x2() {
        let row_hints = vec![vec![1]; 2];
        let col_hints = vec![vec![1]; 2];
        let grid = vec![vec![CellState::Unknown; 2]; 2];
        let (solutions, timed_out) = backtrack_solve(&grid, &row_hints, &col_hints, 2, None);
        assert!(!timed_out);
        assert_eq!(solutions.len(), 2, "Expected 2 solutions for 2x2 with [1],[1]");
    }

    #[test]
    fn test_edge_1x1() {
        let row_hints = vec![vec![1]];
        let col_hints = vec![vec![1]];
        let grid = vec![vec![CellState::Unknown; 1]];
        let (solutions, _) = backtrack_solve(&grid, &row_hints, &col_hints, 2, None);
        assert_eq!(solutions.len(), 1);
        assert_eq!(solutions[0][0][0], CellState::Filled);
    }

    #[test]
    fn test_edge_all_empty() {
        let row_hints: Vec<Vec<u32>> = vec![vec![]; 5];
        let col_hints: Vec<Vec<u32>> = vec![vec![]; 5];
        let grid = vec![vec![CellState::Unknown; 5]; 5];
        let (solutions, _) = backtrack_solve(&grid, &row_hints, &col_hints, 2, None);
        assert_eq!(solutions.len(), 1);
        let result = grid_to_u8(&solutions[0]);
        assert!(result.iter().all(|row| row.iter().all(|&c| c == 0)));
    }

    #[test]
    fn test_edge_all_filled() {
        let row_hints = vec![vec![5]; 5];
        let col_hints = vec![vec![5]; 5];
        let grid = vec![vec![CellState::Unknown; 5]; 5];
        let (solutions, _) = backtrack_solve(&grid, &row_hints, &col_hints, 2, None);
        assert_eq!(solutions.len(), 1);
        let result = grid_to_u8(&solutions[0]);
        assert!(result.iter().all(|row| row.iter().all(|&c| c == 1)));
    }

    #[test]
    fn test_validator_valid() {
        // Cross pattern: row_sum = col_sum = 9
        let row_hints = vec![vec![1], vec![1], vec![5], vec![1], vec![1]];
        let col_hints = vec![vec![1], vec![1], vec![5], vec![1], vec![1]];
        let result = validate_puzzle(5, 5, &row_hints, &col_hints);
        assert!(result.valid, "Errors: {:?}", result.errors);
        assert!(result.errors.is_empty());
    }

    #[test]
    fn test_validator_sum_mismatch() {
        let row_hints = vec![vec![5]; 5]; // total: 25
        let col_hints = vec![vec![1]; 5]; // total: 5
        let result = validate_puzzle(5, 5, &row_hints, &col_hints);
        assert!(!result.valid);
        assert!(result.errors.iter().any(|e| e.contains("一致しません")));
    }

    #[test]
    fn test_validator_hint_too_large() {
        let row_hints = vec![vec![6]]; // needs 6 but width is 5
        let col_hints = vec![vec![1]; 5];
        let result = validate_puzzle(5, 1, &row_hints, &col_hints);
        assert!(!result.valid);
    }

    #[test]
    fn test_timeout() {
        use std::time::{Duration, Instant};
        let deadline = Instant::now() + Duration::from_millis(1);
        std::thread::sleep(Duration::from_millis(2));

        let row_hints = vec![vec![2]; 10];
        let col_hints = vec![vec![2]; 10];
        let grid = vec![vec![CellState::Unknown; 10]; 10];
        let (_, timed_out) = backtrack_solve(&grid, &row_hints, &col_hints, 2, Some(deadline));
        assert!(timed_out);
    }
}
