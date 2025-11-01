---
title: "Hugo 記事の作成・反映手順をまとめてみた"
date: 2025-10-30T08:09:56+09:00
draft: false
summary: "Hugoで記事を作成し、ローカル確認からGitHubを経由して本番サイトへ反映するまでの流れを詳しく解説します。"
tags: ["Hugo", "ブログ構築", "GitHub Actions", "記事作成"]
categories: ["開発ノート"]
---

## はじめに

前回の記事では、なぜ Hugo を選び、どのような構成でブログを動かしているかをご紹介しました。  
今回はその続編として、実際に記事を作成し、公開までの流れをまとめます。

---

## 🪶 Hugo 記事の基本構成

Hugo の記事はすべて `content/` フォルダ内に保存します。  
一般的な構造は次のようになります。

<div class="code-box">

miraiaxis-blog/
├── content/
│ ├── posts/
│ │ ├── blog-01/
│ │ │ └── index.md ← 前回の記事
│ │ ├── blog-02/
│ │ │ └── index.md ← 今回の記事
│ ├── \_index.md ← トップページ（任意）

</div>

各記事フォルダには `index.md` を置くのがポイントです。  
画像を添える場合は、同じフォルダに配置することで相対パスで呼び出せます。

---

## ✍️ 新規記事の作成

Hugo には新しい記事を自動生成するコマンドがあります。

<div class="code-box">

```bash
hugo new posts/blog-02/index.md
</div>

これで content/posts/blog-02/index.md が作成され、
フロントマター（タイトル・日付など）が自動で埋め込まれます。

🧩 フロントマターの設定

ファイルを開くと次のようなヘッダー部分があります。

<div class="code-box">
---
title: "Hugo 記事の作成・反映手順をまとめてみた"
date: 2025-11-01
draft: true
summary: "Hugoでの記事作成から反映までの流れを紹介します。"
tags: ["Hugo", "ブログ構築"]
categories: ["開発ノート"]
---
</div>

draft: true → 下書き状態（公開しない）

draft: false に変更すると公開対象になります

💡 小技：公開前にプレビューしたい場合は hugo server -D（下書きも含めて表示）を使います。

🔍 ローカルでプレビューする

コマンド一発でプレビューサーバが立ち上がります。

<div class="code-box">
hugo server -D --ignoreCache -b http://localhost:1313/blog/
</div>

ブラウザで http://localhost:1313/blog/
 を開くと、
リアルタイムで更新が確認できます。

🚀 GitHubへ反映して公開

記事が完成したら、Gitでリポジトリに反映します。

<div class="code-box">
git add content/posts/blog-02/index.md
git commit -m "post: add blog-02 Hugo記事作成手順"
git push origin main

</div>

push すると自動的に GitHub Actions が動き、
Hugoがビルド → Xserver へFTPアップロード → サイトに反映 されます。

✅ 成功確認は GitHub の Actions タブ または
https://miraiaxis.com/blog/ を開いてリロード（Shift＋再読込）です。

🧭 まとめ

1️⃣ hugo new posts/blog-xx/index.md で記事を作る
2️⃣ hugo server -D で確認する
3️⃣ git add → commit → push で本番へ反映

これだけでブログ更新が完結します。

💬 次回予告

次回は、
「デザインのカスタマイズ方法」 についてまとめます。

見出しの装飾・配色・カード型一覧など、
ブログをさらに見やすくするコツをご紹介する予定です。

Mirai Axis Blog

技術・運用ノートを、実験しながら丁寧に記録していきます。


---

✅ 使い方
1. 上の内容をそのままコピー
2. `content/posts/blog-02/index.md` に貼り付け
3. `hugo server -D` で確認
4. 問題なければ `git add` → `commit` → `push`

これで完璧です。

次回「デザインのカスタマイズ方法」では、実際に一覧カード・見出し装飾・色のバランス調整などを、あなたの現在のCSSに合わせて提案しますね。
```
