use super::types::ValidationResult;

pub fn validate_puzzle(
    width: usize,
    height: usize,
    row_hints: &[Vec<u32>],
    col_hints: &[Vec<u32>],
) -> ValidationResult {
    let mut errors = Vec::new();

    if width == 0 || width > 100 {
        errors.push(format!(
            "幅は1以上100以下である必要があります（現在: {}）",
            width
        ));
    }
    if height == 0 || height > 100 {
        errors.push(format!(
            "高さは1以上100以下である必要があります（現在: {}）",
            height
        ));
    }

    if row_hints.len() != height {
        errors.push(format!(
            "行ヒントの数（{}）が高さ（{}）と一致しません",
            row_hints.len(),
            height
        ));
    }
    if col_hints.len() != width {
        errors.push(format!(
            "列ヒントの数（{}）が幅（{}）と一致しません",
            col_hints.len(),
            width
        ));
    }

    // Check each row hint fits within width
    for (i, hints) in row_hints.iter().enumerate() {
        if !hints.is_empty() {
            let min_length: u32 =
                hints.iter().sum::<u32>() + hints.len().saturating_sub(1) as u32;
            if min_length > width as u32 {
                errors.push(format!(
                    "行{}のヒント{:?}は最低{}マス必要ですが、幅は{}です",
                    i + 1,
                    hints,
                    min_length,
                    width
                ));
            }
        }
        for (j, &h) in hints.iter().enumerate() {
            if h == 0 && hints.len() > 1 {
                errors.push(format!(
                    "行{}のヒント位置{}に0が含まれています",
                    i + 1,
                    j + 1
                ));
            }
        }
    }

    // Check each column hint fits within height
    for (i, hints) in col_hints.iter().enumerate() {
        if !hints.is_empty() {
            let min_length: u32 =
                hints.iter().sum::<u32>() + hints.len().saturating_sub(1) as u32;
            if min_length > height as u32 {
                errors.push(format!(
                    "列{}のヒント{:?}は最低{}マス必要ですが、高さは{}です",
                    i + 1,
                    hints,
                    min_length,
                    height
                ));
            }
        }
        for (j, &h) in hints.iter().enumerate() {
            if h == 0 && hints.len() > 1 {
                errors.push(format!(
                    "列{}のヒント位置{}に0が含まれています",
                    i + 1,
                    j + 1
                ));
            }
        }
    }

    // Cross-check: total filled cells from rows vs columns should match
    let row_total: u32 = row_hints.iter().flat_map(|h| h.iter()).sum();
    let col_total: u32 = col_hints.iter().flat_map(|h| h.iter()).sum();
    if row_total != col_total {
        errors.push(format!(
            "行ヒントの合計（{}）と列ヒントの合計（{}）が一致しません",
            row_total, col_total
        ));
    }

    ValidationResult {
        valid: errors.is_empty(),
        errors,
    }
}
