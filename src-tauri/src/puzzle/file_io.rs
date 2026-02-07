use std::fs;
use std::path::Path;

use super::data::PuzzleData;

pub fn load_puzzle_file(path: &Path) -> Result<PuzzleData, String> {
    let content =
        fs::read_to_string(path).map_err(|e| format!("ファイルの読み込みに失敗しました: {}", e))?;
    let puzzle: PuzzleData = serde_json::from_str(&content)
        .map_err(|e| format!("JSON形式が不正です: {}", e))?;
    Ok(puzzle)
}

pub fn save_puzzle_file(path: &Path, puzzle: &PuzzleData) -> Result<(), String> {
    let json = serde_json::to_string_pretty(puzzle)
        .map_err(|e| format!("シリアライズに失敗しました: {}", e))?;
    fs::write(path, json).map_err(|e| format!("ファイルの書き込みに失敗しました: {}", e))?;
    Ok(())
}
