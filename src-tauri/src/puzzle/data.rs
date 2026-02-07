use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PuzzleData {
    pub version: String,
    pub width: usize,
    pub height: usize,
    pub row_hints: Vec<Vec<u32>>,
    pub col_hints: Vec<Vec<u32>>,
    pub metadata: Option<PuzzleMetadata>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PuzzleMetadata {
    pub title: Option<String>,
    pub author: Option<String>,
    pub difficulty: Option<String>,
    pub created_at: Option<String>,
}
