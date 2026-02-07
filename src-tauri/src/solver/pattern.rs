use super::types::CellState;

/// Generate all valid patterns for a line of given width with given hints.
/// Each pattern is a Vec<CellState> of length `width` containing only Filled/Empty.
pub fn generate_patterns(width: usize, hints: &[u32]) -> Vec<Vec<CellState>> {
    if hints.is_empty() {
        return vec![vec![CellState::Empty; width]];
    }

    let mut results = Vec::new();
    let mut current = vec![CellState::Empty; width];
    generate_recursive(width, hints, 0, 0, &mut current, &mut results);
    results
}

fn generate_recursive(
    width: usize,
    hints: &[u32],
    hint_index: usize,
    pos: usize,
    current: &mut Vec<CellState>,
    results: &mut Vec<Vec<CellState>>,
) {
    if hint_index == hints.len() {
        // Fill remaining with Empty
        for i in pos..width {
            current[i] = CellState::Empty;
        }
        results.push(current.clone());
        return;
    }

    let h = hints[hint_index] as usize;

    // Calculate minimum space needed for remaining hints (after current one)
    let remaining_space: usize = hints[hint_index + 1..]
        .iter()
        .map(|&x| x as usize)
        .sum::<usize>()
        + if hint_index + 1 < hints.len() {
            hints.len() - hint_index - 1 // gaps between remaining blocks
        } else {
            0
        };

    if pos + h + remaining_space > width {
        return; // Not enough space
    }

    let max_start = width - h - remaining_space;

    for start in pos..=max_start {
        // Save state
        let saved: Vec<CellState> = current.clone();

        // Fill empty before block
        for i in pos..start {
            current[i] = CellState::Empty;
        }

        // Fill the block
        for i in start..start + h {
            current[i] = CellState::Filled;
        }

        // After the block
        let next_pos = if hint_index < hints.len() - 1 {
            // Mandatory gap after block (not the last hint)
            if start + h < width {
                current[start + h] = CellState::Empty;
            }
            start + h + 1
        } else {
            start + h
        };

        generate_recursive(width, hints, hint_index + 1, next_pos, current, results);

        // Restore state
        *current = saved;
    }
}

/// Filter patterns that are compatible with already-known cells.
pub fn filter_patterns(patterns: &[Vec<CellState>], known: &[CellState]) -> Vec<Vec<CellState>> {
    patterns
        .iter()
        .filter(|pattern| {
            pattern
                .iter()
                .zip(known.iter())
                .all(|(p, k)| *k == CellState::Unknown || p == k)
        })
        .cloned()
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_empty_hints() {
        let patterns = generate_patterns(5, &[]);
        assert_eq!(patterns.len(), 1);
        assert!(patterns[0].iter().all(|c| *c == CellState::Empty));
    }

    #[test]
    fn test_single_hint_full() {
        let patterns = generate_patterns(5, &[5]);
        assert_eq!(patterns.len(), 1);
        assert!(patterns[0].iter().all(|c| *c == CellState::Filled));
    }

    #[test]
    fn test_two_hints() {
        let patterns = generate_patterns(5, &[2, 1]);
        assert_eq!(patterns.len(), 3);
    }

    #[test]
    fn test_single_hint_various_positions() {
        let patterns = generate_patterns(5, &[1]);
        assert_eq!(patterns.len(), 5);
    }

    #[test]
    fn test_filter_compatible() {
        let patterns = generate_patterns(5, &[2, 1]);
        let known = vec![
            CellState::Filled,
            CellState::Unknown,
            CellState::Unknown,
            CellState::Unknown,
            CellState::Unknown,
        ];
        let filtered = filter_patterns(&patterns, &known);
        // Only patterns where pos 0 is Filled
        assert!(filtered.iter().all(|p| p[0] == CellState::Filled));
    }

    #[test]
    fn test_1x1_filled() {
        let patterns = generate_patterns(1, &[1]);
        assert_eq!(patterns.len(), 1);
        assert_eq!(patterns[0][0], CellState::Filled);
    }

    #[test]
    fn test_1x1_empty() {
        let patterns = generate_patterns(1, &[]);
        assert_eq!(patterns.len(), 1);
        assert_eq!(patterns[0][0], CellState::Empty);
    }
}
