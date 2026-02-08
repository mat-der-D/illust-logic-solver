# Illust Logic Solver

お絵かきロジック（ノノグラム）を自動で解くデスクトップアプリケーションです。

## 主な機能

- ヒント入力またはマス目の直接入力によるパズル作成
- 論理推論とバックトラッキングを組み合わせた高速な自動求解
- 唯一解・複数解・解なしの判定
- パズルデータの保存・読み込み（JSON形式）

## 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フレームワーク | Tauri 2.0 |
| フロントエンド | React 19 + TypeScript + Tailwind CSS v4 |
| 状態管理 | Zustand |
| バックエンド | Rust |
| パッケージマネージャ | pnpm |

## 必要な環境

- **Node.js** 18 以上
- **Rust** 1.77.2 以上
- **pnpm**
- **Tauri CLI**

### pnpm のインストール

```bash
corepack enable
```

または

```bash
npm install -g pnpm
```

### Tauri CLI のインストール

```bash
cargo install tauri-cli --version "^2"
```

### Linux の追加依存パッケージ

Ubuntu / Debian の場合:

```bash
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

### macOS の追加依存パッケージ

```bash
xcode-select --install
```

### Windows の追加依存パッケージ

[Visual Studio の C++ ビルドツール](https://visualstudio.microsoft.com/ja/visual-cpp-build-tools/) をインストールしてください。

## セットアップ

```bash
pnpm install
```

## 開発

Tauri デスクトップアプリとして起動（ホットリロード対応）:

```bash
cargo tauri dev
```

フロントエンドのみ起動（ブラウザで確認）:

```bash
pnpm dev
```

## テスト

Rust のテストを実行:

```bash
cd src-tauri
cargo test
```

特定のテストのみ実行:

```bash
cd src-tauri
cargo test テスト名
```

## ビルド

プロダクションビルドを行い、インストーラーを生成します:

```bash
cargo tauri build
```

ビルドが完了すると、実行ファイルとインストーラーが `src-tauri/target/release/bundle/` 以下に出力されます。

## インストーラーの作成

`cargo tauri build` を実行すると、ビルドを行ったプラットフォームに対応するインストーラーが自動的に生成されます。

### 各プラットフォームの出力形式

**Linux:**

| 形式 | 出力先 |
|------|--------|
| `.deb` | `src-tauri/target/release/bundle/deb/` |
| `.AppImage` | `src-tauri/target/release/bundle/appimage/` |

**Windows:**

| 形式 | 出力先 |
|------|--------|
| `.msi` | `src-tauri/target/release/bundle/msi/` |
| `.exe` (NSIS) | `src-tauri/target/release/bundle/nsis/` |

**macOS:**

| 形式 | 出力先 |
|------|--------|
| `.dmg` | `src-tauri/target/release/bundle/dmg/` |
| `.app` | `src-tauri/target/release/bundle/macos/` |

### 特定の形式のみ生成する

すべてのインストーラーを生成する必要がない場合は、`--bundles` オプションで指定できます:

```bash
# deb パッケージのみ
cargo tauri build --bundles deb

# AppImage のみ
cargo tauri build --bundles appimage

# 複数指定
cargo tauri build --bundles deb,appimage
```

## プロジェクト構成

```
├── src/           React フロントエンド
├── src-tauri/     Rust バックエンド & Tauri 設定
│   └── src/
│       ├── solver/    求解アルゴリズム
│       └── puzzle/    パズルデータ管理
├── docs/          仕様書・アルゴリズム解説
│   └── samples/   サンプルパズル（JSON）
└── samples/       追加サンプル
```

## ライセンス

[MIT License](LICENSE)
