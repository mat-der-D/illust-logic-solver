use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum CellState {
    Unknown,
    Filled,
    Empty,
}

pub type Grid = Vec<Vec<CellState>>;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum SolveResult {
    UniqueSolution { grid: Vec<Vec<u8>> },
    MultipleSolutions,
    NoSolution,
    Timeout { elapsed_seconds: f64 },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ValidationResult {
    pub valid: bool,
    pub errors: Vec<String>,
}
