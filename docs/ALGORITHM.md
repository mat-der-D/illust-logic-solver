# イラストロジック ソルバーアルゴリズム詳細仕様

## 1. イラストロジックの基本ルール

### 1.1 パズルの構成

- **グリッド**: N×Mのマス目（セル）で構成される
- **ヒント**: 各行・各列に数値の列が与えられる
- **セルの状態**: 各セルは「塗りつぶし」または「空白」のいずれか

### 1.2 ヒントの意味

各行・列のヒントは、**連続して塗りつぶされるセルの個数**を左から順（または上から順）に表す。

**例**: ヒント `[2, 1, 3]` は以下を意味する：
- 最初に2個連続で塗りつぶされたセルがある
- 次に少なくとも1個の空白を挟んで1個塗りつぶされたセルがある
- さらに少なくとも1個の空白を挟んで3個連続で塗りつぶされたセルがある

```
例: [2, 1, 3] のパターン
■■ □ ■ □ ■■■  (間の空白は1個以上なら何個でも良い)
■■ □□ ■ □□ ■■■  (これも正解)
```

### 1.3 解の条件

- すべての行・列のヒントを満たすようにセルを塗りつぶす
- **一意解**: 条件を満たす塗り方が唯一つに定まる
- **複数解**: 条件を満たす塗り方が複数存在する（パズルとして不適切）
- **解なし**: ヒントに矛盾があり、解が存在しない

---

## 2. ソルバーアルゴリズムの全体構成

イラストロジックのソルバーは、以下の2段階のアプローチで実装する：

```
1. 論理的推論（Line Solving）
   ↓
2. バックトラック探索（必要な場合のみ）
```

### 2.1 基本フロー

```
1. 初期化: すべてのセルを「未確定」状態にする
2. 論理的推論を繰り返し適用する
   - 各行を解析して確定できるセルを決定
   - 各列を解析して確定できるセルを決定
   - 新たに確定したセルがなくなるまで繰り返す
3. すべてのセルが確定したら終了（解答完成）
4. まだ未確定のセルがある場合:
   - バックトラック探索に移行
   - 仮定を置いて探索を続ける
5. 矛盾が見つかったら解なし
6. 複数の解が見つかったら複数解と判定
```

---

## 3. 論理的推論（Line Solving）

### 3.1 基本原理

各行（または列）について、ヒントから**確実に塗りつぶされるセル**または**確実に空白のセル**を特定する。

### 3.2 アルゴリズム: 1行の解析

ある1行（幅Wのセル列）とヒント `[h1, h2, ..., hn]` が与えられたとき：

#### Step 1: 可能な配置パターンをすべて生成

ヒントを満たすすべての可能な塗り方を列挙する。

**生成方法（再帰的）**:
```
関数 generatePatterns(width, hints):
    if hints が空:
        return [[空白 × width]]

    result = []
    first_hint = hints[0]
    remaining_hints = hints[1:]

    // 最初のヒントを配置できる位置を試す
    min_space_needed = sum(remaining_hints) + len(remaining_hints)  // 残りのヒントに必要な最小スペース

    for start_pos in 0 to (width - first_hint - min_space_needed):
        // start_pos に first_hint 個のセルを配置
        pattern = [空白 × start_pos] + [塗り × first_hint] + [空白 × 1]

        // 残りのヒントを再帰的に配置
        remaining_width = width - len(pattern)
        sub_patterns = generatePatterns(remaining_width, remaining_hints)

        for sub in sub_patterns:
            result.add(pattern + sub)

    return result
```

**例**: 幅5、ヒント `[2, 1]`
```
可能なパターン:
■■ □ ■ □     (パターン1)
■■ □□ ■      (パターン2)
□ ■■ □ ■     (パターン3)
```

#### Step 2: 既知の情報でフィルタリング

すでに確定しているセル（塗りつぶし/空白）と矛盾するパターンを除外する。

```
関数 filterPatterns(patterns, known_cells):
    valid_patterns = []
    for pattern in patterns:
        if pattern が known_cells と矛盾しない:
            valid_patterns.add(pattern)
    return valid_patterns
```

#### Step 3: 共通部分を抽出

すべての有効なパターンで共通して塗りつぶされているセル、または共通して空白のセルを確定する。

```
関数 extractCommon(valid_patterns):
    result = [未確定 × width]

    for i in 0 to width-1:
        all_filled = True
        all_empty = True

        for pattern in valid_patterns:
            if pattern[i] != 塗り:
                all_filled = False
            if pattern[i] != 空白:
                all_empty = False

        if all_filled:
            result[i] = 塗り
        else if all_empty:
            result[i] = 空白

    return result
```

### 3.3 最適化: Simple Boxes（単純な重なり判定）

パターン生成をせず、より高速に確定セルを見つける手法。

#### 原理: 最左配置と最右配置の重なり

ヒントを**最も左に詰めた配置**と**最も右に詰めた配置**を計算し、両方で塗りつぶされる部分は確定。

**例**: 幅10、ヒント `[7]`
```
最左配置: ■■■■■■■ □□□
最右配置: □□□ ■■■■■■■
重なり:   ???■■■■???    ← 中央4マスは確定で塗り
```

**実装**:
```
関数 simpleBoxes(width, hint):
    // ヒントが1つの場合の簡易判定
    if len(hint) == 1:
        h = hint[0]
        overlap_start = width - h
        overlap_end = h

        if overlap_start < overlap_end:
            // overlap_start から overlap_end までは確定で塗り
            return [overlap_start, overlap_end)

    // 複数ヒントの場合は省略（完全なパターン生成が必要）
```

### 3.4 反復適用

1. すべての行について論理的推論を適用
2. すべての列について論理的推論を適用
3. 新たに確定したセルがあれば、1に戻る
4. 確定するセルがなくなったら終了

```
関数 logicalSolve(grid, row_hints, col_hints):
    changed = True

    while changed:
        changed = False

        // 各行を解析
        for row_index in 0 to height-1:
            row_data = grid[row_index]
            hint = row_hints[row_index]
            new_row = solveLine(row_data, hint)

            if new_row != row_data:
                grid[row_index] = new_row
                changed = True

        // 各列を解析
        for col_index in 0 to width-1:
            col_data = extract_column(grid, col_index)
            hint = col_hints[col_index]
            new_col = solveLine(col_data, hint)

            if new_col != col_data:
                set_column(grid, col_index, new_col)
                changed = True

    return grid
```

---

## 4. バックトラック探索

論理的推論だけでは解けない場合（未確定セルが残る場合）、バックトラック（試行錯誤）を使用する。

### 4.1 基本アルゴリズム

```
関数 backtrackSolve(grid, row_hints, col_hints):
    // 論理的推論を最大限適用
    grid = logicalSolve(grid, row_hints, col_hints)

    // すべて確定したかチェック
    if grid が完全に確定:
        if grid がすべてのヒントを満たす:
            return [grid]  // 解を1つ見つけた
        else:
            return []  // 矛盾

    // 未確定セルを1つ選ぶ
    (row, col) = 最初の未確定セル

    solutions = []

    // 塗りつぶしを試す
    grid_copy = grid.clone()
    grid_copy[row][col] = 塗り
    solutions += backtrackSolve(grid_copy, row_hints, col_hints)

    // 空白を試す
    grid_copy = grid.clone()
    grid_copy[row][col] = 空白
    solutions += backtrackSolve(grid_copy, row_hints, col_hints)

    return solutions
```

### 4.2 最適化: 早期枝刈り

各仮定を置いた後、すぐに矛盾チェックを行う。

```
関数 isConsistent(grid, row_hints, col_hints):
    // 各行が現在の状態でヒントと矛盾しないかチェック
    for row_index in 0 to height-1:
        if not canSatisfyHint(grid[row_index], row_hints[row_index]):
            return False

    // 各列が現在の状態でヒントと矛盾しないかチェック
    for col_index in 0 to width-1:
        col_data = extract_column(grid, col_index)
        if not canSatisfyHint(col_data, col_hints[col_index]):
            return False

    return True

関数 canSatisfyHint(line, hint):
    // この行/列が、hint を満たす可能性があるかチェック
    // (確定したセルだけで判断し、未確定セルは柔軟に扱う)
    patterns = generatePatterns(len(line), hint)
    filtered = filterPatterns(patterns, line)
    return len(filtered) > 0
```

### 4.3 最適化: 未確定セルの選択戦略

どの未確定セルを選ぶかで探索効率が変わる。

**推奨戦略**:
- **制約が最も強いセルを選ぶ**（所属する行・列のヒントが複雑なセル）
- または**最初の未確定セル**（シンプルで実装が簡単）

---

## 5. 一意解判定

複数解が存在するかを検出する方法。

### 5.1 アルゴリズム

`solvePuzzle` はバックトラック探索で解を最大2つ探し、即座に終了する。これにより解なし・一意解・複数解を区別できる。

```
関数 solvePuzzle(grid, row_hints, col_hints):
    solutions = backtrackSolve(grid, row_hints, col_hints, max_solutions=2)

    if len(solutions) == 0:
        return "解なし"
    else if len(solutions) == 1:
        return ("一意解", solutions[0])
    else:
        return "複数解"

関数 backtrackSolve(grid, row_hints, col_hints, max_solutions):
    // max_solutions 個の解を見つけたら探索を打ち切る
    // (上記のバックトラックアルゴリズムを改良)
    ...
```

---

## 6. パフォーマンス最適化

### 6.1 論理的推論の優先

バックトラックは計算コストが高いため、論理的推論を最大限活用する。

- 各バックトラックステップの後、必ず論理的推論を再適用
- 可能な限り多くのセルを論理的推論で確定させる

### 6.2 パターンキャッシュ

同じヒントに対するパターン生成結果をキャッシュする。

```
cache = {}

関数 generatePatternsWithCache(width, hints):
    key = (width, tuple(hints))
    if key in cache:
        return cache[key]

    patterns = generatePatterns(width, hints)
    cache[key] = patterns
    return patterns
```

### 6.3 タイムアウト実装

長時間計算を防ぐため、タイムアウトを設ける。

```
start_time = current_time()
timeout_seconds = 60

関数 solve(grid, row_hints, col_hints):
    if current_time() - start_time > timeout_seconds:
        raise TimeoutError("解答に時間がかかりすぎています")

    // 通常の解答処理
    ...
```

---

## 7. 実装の推奨手順

### Phase 1: 基本的な論理的推論
1. パターン生成アルゴリズムの実装
2. 1行の解析（`solveLine`）の実装
3. 反復適用（`logicalSolve`）の実装
4. 小さな問題（5×5程度）でテスト

### Phase 2: バックトラック探索
1. 基本的なバックトラックの実装
2. 矛盾チェックの実装
3. 中程度の問題（15×15程度）でテスト

### Phase 3: 最適化
1. Simple Boxes の実装（高速化）
2. パターンキャッシュの実装
3. 早期枝刈りの強化
4. 大きな問題（50×50程度）でテスト

### Phase 4: 一意解判定とタイムアウト
1. 複数解検出の実装
2. タイムアウト機能の実装
3. エッジケースのテスト

---

## 8. テストケースの推奨

実装の各段階で以下のテストケースを使用：

1. **簡単な問題**: 論理的推論のみで解ける（5×5）
2. **中程度の問題**: 論理的推論のみで解ける（15×15）
3. **バックトラックが必要な問題**: 推論だけでは解けない（10×10）
4. **複数解を持つ問題**: 一意性判定のテスト
5. **解が存在しない問題**: 矛盾検出のテスト
6. **エッジケース**: 1×1、すべて空白、すべて塗りなど

---

## 9. 擬似コードまとめ

### 9.1 メインソルバー

```rust
enum CellState {
    Unknown,
    Filled,
    Empty,
}

type Grid = Vec<Vec<CellState>>;

enum SolveResult {
    UniqueSolution(Grid),
    MultipleSolutions,
    NoSolution,
}

fn solve(row_hints: Vec<Vec<u32>>, col_hints: Vec<Vec<u32>>) -> SolveResult {
    let width = col_hints.len();
    let height = row_hints.len();
    let mut grid = vec![vec![CellState::Unknown; width]; height];

    // 論理的推論を適用
    logical_solve(&mut grid, &row_hints, &col_hints);

    // バックトラック探索（最大2解まで）
    let solutions = backtrack_solve(grid, &row_hints, &col_hints, 2);

    match solutions.len() {
        0 => SolveResult::NoSolution,
        1 => SolveResult::UniqueSolution(solutions[0].clone()),
        _ => SolveResult::MultipleSolutions,
    }
}

fn logical_solve(grid: &mut Grid, row_hints: &[Vec<u32>], col_hints: &[Vec<u32>]) {
    let mut changed = true;

    while changed {
        changed = false;

        // 各行を解析
        for row in 0..grid.len() {
            let new_row = solve_line(&grid[row], &row_hints[row]);
            if new_row != grid[row] {
                grid[row] = new_row;
                changed = true;
            }
        }

        // 各列を解析
        for col in 0..grid[0].len() {
            let col_data: Vec<_> = grid.iter().map(|row| row[col]).collect();
            let new_col = solve_line(&col_data, &col_hints[col]);
            if new_col != col_data {
                for row in 0..grid.len() {
                    grid[row][col] = new_col[row];
                }
                changed = true;
            }
        }
    }
}

fn solve_line(line: &[CellState], hint: &[u32]) -> Vec<CellState> {
    // パターン生成
    let patterns = generate_patterns(line.len(), hint);

    // 既知の情報でフィルタリング
    let valid_patterns: Vec<_> = patterns
        .into_iter()
        .filter(|p| is_compatible(p, line))
        .collect();

    // 共通部分を抽出
    let mut result = vec![CellState::Unknown; line.len()];
    for i in 0..line.len() {
        let all_filled = valid_patterns.iter().all(|p| p[i] == CellState::Filled);
        let all_empty = valid_patterns.iter().all(|p| p[i] == CellState::Empty);

        if all_filled {
            result[i] = CellState::Filled;
        } else if all_empty {
            result[i] = CellState::Empty;
        } else {
            result[i] = line[i];  // 既知の情報を保持
        }
    }

    result
}

fn generate_patterns(width: usize, hints: &[u32]) -> Vec<Vec<CellState>> {
    // 再帰的にパターンを生成（実装省略）
    // ...
}

fn backtrack_solve(
    grid: Grid,
    row_hints: &[Vec<u32>],
    col_hints: &[Vec<u32>],
    max_solutions: usize,
) -> Vec<Grid> {
    // バックトラック探索（実装省略）
    // ...
}
```

---

## 10. 参考文献・リソース

### アルゴリズム解説
- [Nonogram Solver Algorithms - Wikipedia](https://en.wikipedia.org/wiki/Nonogram#Solution_techniques)
- [Jan Wolter's Survey of Paint-by-Number Puzzle Solvers](https://webpbn.com/survey/)

### 実装例
- [pbnsolve](https://github.com/mikix/pbnsolve) - C言語実装
- [nonogram-rs](https://github.com/tsionyx/nonogram) - Rust実装

### 論文
- Simpson, S. (2001). "Solving Nonograms with Compressive Imaging and Combinatorial Optimization"

---

## 11. 補足: ヒント生成（ビジュアルモード用）

ビジュアル作成モードで、塗りつぶされたグリッドからヒントを生成する方法。

### アルゴリズム

```rust
fn generate_hints(grid: &Grid) -> (Vec<Vec<u32>>, Vec<Vec<u32>>) {
    let height = grid.len();
    let width = grid[0].len();

    let mut row_hints = vec![];
    let mut col_hints = vec![];

    // 各行のヒント生成
    for row in 0..height {
        let hint = generate_line_hint(&grid[row]);
        row_hints.push(hint);
    }

    // 各列のヒント生成
    for col in 0..width {
        let col_data: Vec<_> = grid.iter().map(|row| row[col]).collect();
        let hint = generate_line_hint(&col_data);
        col_hints.push(hint);
    }

    (row_hints, col_hints)
}

fn generate_line_hint(line: &[CellState]) -> Vec<u32> {
    let mut hints = vec![];
    let mut count = 0;

    for &cell in line {
        match cell {
            CellState::Filled => {
                count += 1;
            }
            _ => {
                if count > 0 {
                    hints.push(count);
                    count = 0;
                }
            }
        }
    }

    // 最後の連続塗りつぶしを追加
    if count > 0 {
        hints.push(count);
    }

    hints
}
```

**例**:
```
グリッド行: [■, ■, □, ■, □, ■, ■, ■]
生成されるヒント: [2, 1, 3]
```

---

**最終更新**: 2026年2月7日
