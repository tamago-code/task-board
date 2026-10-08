# task-board

このプロジェクト固有のルール。共通ルールはグローバルの `~/.claude/CLAUDE.md` に従い、ここには繰り返さない。

## プロジェクト概要

タスクの追加・完了切り替え・削除ができるタスクボードアプリ。バックエンドはなく、タスクはブラウザの localStorage(キー `task-board.tasks`)に保存する。

- 開発サーバー: `npm run dev`
- テスト: `npm test`
- 型チェック+ビルド: `npm run build`
- lint: `npm run lint`

## 技術スタック

バージョンは `package.json` / `package-lock.json` が正。

- UI: React 19(関数コンポーネント + Hooks のみ。状態管理ライブラリ・ルーターは使っていない)
- 言語: TypeScript 6(`noUnusedLocals` / `noUnusedParameters` と `verbatimModuleSyntax` を有効化)
- ビルド: Vite 8(`base: './'` で相対パス出力)
- テスト: Vitest 5 + Testing Library(React / user-event)+ jsdom
- lint: oxlint
- スタイル: プレーン CSS(`src/index.css` の1ファイル。CSS 変数でライト/ダークを切り替え)
- CI/CD: GitHub Actions(Node 24)→ GitHub Pages

## デプロイ先

https://tamago-code.github.io/task-board/

`main` へのプッシュで `.github/workflows/deploy.yml` がテスト・ビルドし、GitHub Pages へデプロイする。`main` へのプッシュはそのまま公開になる。

## コンポーネントの命名規約

現状のコード(`src/App.tsx`)に合わせた規約。新しいコンポーネントもこれに揃える。

- ファイル名: PascalCase の `.tsx`(例: `App.tsx`)。1ファイル1コンポーネントで、`export default` する。
- コンポーネント: `function App() {}` のように関数宣言で書き、名前はファイル名と同じにする。
- テスト: 対象と同じ場所に `<コンポーネント名>.test.tsx` を置く(例: `App.test.tsx`)。テスト名は日本語で振る舞いを書く。
- 型: PascalCase の `type` エイリアス(例: `Task`)。`interface` は使っていない。型のみの import は `import { type X }` と書く。
- イベントハンドラ・関数: camelCase の「動詞 + 名詞」(例: `addTask`、`toggleTask`、`deleteTask`)。
- 定数: UPPER_SNAKE_CASE(例: `STORAGE_KEY`)。localStorage のキーは `task-board.<名前>` 形式。
- import: 拡張子付きで書く(例: `import App from './App.tsx'`)。
- CSS クラス: kebab-case(例: `add-form`、`task-list`)。状態は修飾クラスを併記する(例: `task done`)。

## Git運用ルール

- コードを変更したら、そのたびにコミットして GitHub(`origin`)へプッシュする。都度の依頼は不要。このプロジェクトでは、グローバルルールの「コミットは明示的に依頼された場合のみ」よりこちらを優先する。
- 区切りは1つの依頼(タスク)が完了した時点とする。編集1回ごとや1ファイルごとに分けなくてよい。
- 手順:
  1. テスト・型チェックがあれば実行する。失敗した場合はコミット・プッシュせずに報告する。
  2. `git status` と `git diff` で差分を確認し、意図した変更だけをファイル指定でステージする(`git add -A` / `git add .` は使わない)。
  3. 変更内容が分かるメッセージでコミットする。
  4. 現在のブランチを `git push` する(上流未設定なら `git push -u origin <branch>`)。
  5. コミットハッシュとプッシュ先ブランチを報告する。
- 秘密情報(`.env`、APIキー、認証情報など)はコミットしない。差分に含まれていたら作業を止めて報告する。
- 次の場合はプッシュせず、状況を報告して指示を待つ:
  - リモート `origin` が未設定、または認証エラーで失敗した
  - リモートが先行していてプッシュが拒否された(勝手に rebase・merge・force push しない)
- force push、`git reset --hard`、ブランチ削除、履歴の書き換えは、対象を示して事前に承認を得てから行う。
