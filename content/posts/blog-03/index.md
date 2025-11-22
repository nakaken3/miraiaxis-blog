---
title: "Hugo ブログのデザインをカスタマイズする方法まとめ【見出し・配色・カード一覧など】"
date: 2025-11-05T08:09:56+09:00
draft: false
summary: "Hugo ブログを読みやすく、美しくデザインするための CSS カスタマイズ手法を具体例とともに解説します。配色・見出し改善・カード型一覧・トップバーの調整などを紹介。"
tags: ["Hugo", "デザイン", "CSS", "カスタマイズ"]
categories: ["開発ノート"]
---

# はじめに

前回の記事では、**Hugo で記事を作成し、GitHub Actions と連携して本番反映する方法** を解説しました。

今回はシリーズ第 3 回として、  
**デザインをカスタマイズしてブログ全体を読みやすくする方法** をまとめていきます。

本ブログ（https://miraiaxis.com/blog/）は “できるだけシンプルに、長期間安全に運用できる” を重視しているため、  
**CSS の調整だけで大幅に改善できるポイント** を中心に紹介します。

---

# 🎨 Hugo ブログのデザイン改善の考え方

Hugo は静的サイトジェネレーターなので、  
**デザインはほぼすべて CSS で自由に調整できます。**

特に改善すると効果が大きいのは次の 4 点です。

1. **トップバー（メニュー）の視認性向上**
2. **見出し（H1/H2/H3）のメリハリ付け**
3. **本文の可読性（文字色・行間）**
4. **一覧ページ（/posts/）のカード型レイアウト**

以下、それぞれを具体的に紹介します。

---

# 1️⃣ トップバー（ナビゲーション）の強調

Hugo テーマをそのまま使うと、トップバーの色味が弱く  
「どこがリンクなのか」「今どのページにいるのか」が分かりにくいことがあります。

以下のように軽く装飾を加えるだけで、  
**アクセントカラーが入り、滞在時間も向上します。**

### ✔ カスタム CSS（custom.css）例

```css
/* ホバー強調 */
.site-topbar .nav-tabs a:hover {
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}

/* 現在地（active）の強調 */
.site-topbar .nav-tabs a.active {
  font-weight: 600;
  color: #2563eb;
  border-bottom: 2px solid #2563eb;
}
```

---

# 2️⃣ 見出し（H2/H3）のメリハリを強化

Hugo のデフォルトだと、見出しが少し地味で記事の「流れ」が掴みにくくなる場合があります。

以下のようにラインや字間を加えると、  
**一気に読みやすくなります。**

```css
h2 {
  font-size: 1.7rem;
  padding-bottom: 0.3rem;
  border-bottom: 2px solid #e5e7eb;
  margin-top: 2.2rem;
}

h3 {
  font-size: 1.3rem;
  margin-top: 1.8rem;
  color: #1e293b;
}
```

---

# 3️⃣ 本文の文字色・行間の最適化

可読性に一番効くのは **文字色と行間の調整** です。

実際のブログでも採用している設定例がこちら：

```css
:root {
  --text: #0f172a;
  --muted: #475569;
}

p,
li {
  font-size: 1.05rem;
  line-height: 1.9;
  color: var(--muted);
}
```

文章を読むときのストレスが大きく減ります。

---

# 4️⃣ 投稿一覧ページを “カード型レイアウト” にする

記事数が増えてくると、  
**カード型のほうが視覚的に読みやすくなります。**

以下は簡易的な「2 列カード」サンプルです。

```css
.post-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.post-card {
  padding: 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: 0.2s;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
}

.post-card-title {
  font-size: 1.3rem;
  margin-bottom: 6px;
}
```

HTML 側にほんの少し書くだけで実現できますが、  
これは次回の「Hugo テンプレート編集編」で詳しく紹介します。

---

# 5️⃣ コードブロック（`codebox`）の改善

ブログに技術的な内容を多く扱う場合、  
**コードブロックを「読みやすく / コピーしやすく」する工夫が重要** です。

現在のブログで導入しているスタイルはこんな感じです：

```css
.code-box {
  background: #f9f9fb;
  border-left: 4px solid #b3c0ff;
  border-radius: 6px;
  padding: 0.8em 1em;
  margin: 1.4em 0;
}
```

ユーザーが長いコードを読むとき、とても快適になります。

---

# 6️⃣ スクロール進捗バー（UI 向上効果が高い）

最近の Web メディアでもよく採用される「進捗バー」も  
**JavaScript 30 行で簡単に実現**できます。

```html
<div id="progress-bar"></div>

<script>
  const bar = document.getElementById("progress-bar");
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = scrolled + "%";
  });
</script>
```

CSS はこれだけ：

```css
#progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0;
  background: #2563eb;
  z-index: 9999;
}
```

ページの「読み進めやすさ」がぐっと上がります。

---

# 🧭 まとめ

今回は、Hugo ブログで **デザインを改善するための実用的なカスタマイズ** を紹介しました。

- トップバー強調
- 見出し装飾
- 本文の配色と行間
- カード型レイアウト
- コードブロックのデザイン
- スクロール進捗バー

これらを組み合わせるだけで、ブログ全体の完成度は大きく向上します。

---

# ✍️ 次回予告

次回はシリーズ第 4 回として、  
**「カード型一覧ページを実装するテンプレート編集」** を解説します。

- `_default/list.html` の作り方
- `.Title` / `.Summary` / `.Params` の使い方
- featured image の扱い
- カードを増減しやすい構成

など、今回のデザイン改善を踏まえた**実践的なテンプレート設計**を紹介します。

---

Mirai Axis Blog  
技術と運用の記録を、丁寧に積み重ねていきます。
