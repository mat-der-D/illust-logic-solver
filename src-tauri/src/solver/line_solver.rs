use super::pattern::{filter_patterns, generate_patterns};
use super::types::CellState;

/// Solve a single line: given current cell states and hints,
/// return updated cell states with any newly determined cells.
/// Returns None if the line has no valid patterns (contradiction).
pub fn solve_line(line: &[CellState], hints: &[u32]) -> Option<Vec<CellState>> {
    let effective_hints = normalize_hints(hints);

    let all_patterns = generate_patterns(line.len(), &effective_hints);
    let valid = filter_patterns(&all_patterns, line);

    if valid.is_empty() {
        return None; // Contradiction: no valid pattern exists
    }

    let mut result = line.to_vec();
    for i in 0..line.len() {
        if result[i] != CellState::Unknown {
            continue; // Already determined
        }

        let all_filled = valid.iter().all(|p| p[i] == CellState::Filled);
        let all_empty = valid.iter().all(|p| p[i] == CellState::Empty);

        if all_filled {
            result[i] = CellState::Filled;
        } else if all_empty {
            result[i] = CellState::Empty;
        }
    }

    Some(result)
}

/// Normalize hints: treat [0] as empty (same as []).
fn normalize_hints(hints: &[u32]) -> Vec<u32> {
    if hints.len() == 1 && hints[0] == 0 {
        vec![]
    } else {
        hints.to_vec()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_solve_line_full() {
        let line = vec![CellState::Unknown; 5];
        let result = solve_line(&line, &[5]).unwrap();
        assert!(result.iter().all(|c| *c == CellState::Filled));
    }

    #[test]
    fn test_solve_line_empty() {
        let line = vec![CellState::Unknown; 5];
        let result = solve_line(&line, &[]).unwrap();
        assert!(result.iter().all(|c| *c == CellState::Empty));
    }

    #[test]
    fn test_solve_line_zero_hint() {
        let line = vec![CellState::Unknown; 5];
        let result = solve_line(&line, &[0]).unwrap();
        assert!(result.iter().all(|c| *c == CellState::Empty));
    }

    #[test]
    fn test_solve_line_partial() {
        // Width 10, hint [7] -> overlap of 4 in the middle
        let line = vec![CellState::Unknown; 10];
        let result = solve_line(&line, &[7]).unwrap();
        // Positions 3..7 should be filled (overlap region)
        for i in 3..7 {
            assert_eq!(result[i], CellState::Filled, "position {} should be filled", i);
        }
    }

    #[test]
    fn test_solve_line_contradiction() {
        // Hint says fill all 5, but pos 2 is known empty
        let mut line = vec![CellState::Unknown; 5];
        line[2] = CellState::Empty;
        let result = solve_line(&line, &[5]);
        assert!(result.is_none());
    }
}
