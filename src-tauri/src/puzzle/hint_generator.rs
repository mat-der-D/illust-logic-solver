/// Generate row and column hints from a grid of 0s and 1s.
pub fn generate_hints(grid: &[Vec<u8>]) -> (Vec<Vec<u32>>, Vec<Vec<u32>>) {
    let height = grid.len();
    let width = if height > 0 { grid[0].len() } else { 0 };

    let row_hints: Vec<Vec<u32>> = grid.iter().map(|row| line_hint(row)).collect();

    let col_hints: Vec<Vec<u32>> = (0..width)
        .map(|c| {
            let col: Vec<u8> = (0..height).map(|r| grid[r][c]).collect();
            line_hint(&col)
        })
        .collect();

    (row_hints, col_hints)
}

fn line_hint(line: &[u8]) -> Vec<u32> {
    let mut hints = Vec::new();
    let mut count = 0u32;

    for &cell in line {
        if cell == 1 {
            count += 1;
        } else {
            if count > 0 {
                hints.push(count);
                count = 0;
            }
        }
    }
    if count > 0 {
        hints.push(count);
    }
    hints
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_line_hint_basic() {
        assert_eq!(line_hint(&[1, 1, 0, 1, 0, 1, 1, 1]), vec![2, 1, 3]);
    }

    #[test]
    fn test_line_hint_empty() {
        assert_eq!(line_hint(&[0, 0, 0]), Vec::<u32>::new());
    }

    #[test]
    fn test_line_hint_full() {
        assert_eq!(line_hint(&[1, 1, 1, 1, 1]), vec![5]);
    }

    #[test]
    fn test_generate_hints_grid() {
        let grid = vec![
            vec![1, 0, 1],
            vec![1, 1, 1],
            vec![0, 1, 0],
        ];
        let (row_hints, col_hints) = generate_hints(&grid);
        assert_eq!(row_hints, vec![vec![1, 1], vec![3], vec![1]]);
        assert_eq!(col_hints, vec![vec![2], vec![2], vec![2]]);
    }
}
