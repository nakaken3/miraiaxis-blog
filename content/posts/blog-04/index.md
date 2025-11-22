---
title: "Hugoでブログ一覧をカード型レイアウトにする【セクションテンプレート実装】"
date: 2025-11-06T08:10:05+09:00
draft: false
summary: "Hugoのテンプレート機能を使って、/posts/ の一覧ページをカード型レイアウトにカスタマイズする手順を解説します。layouts/posts/list.html の作成から、CSSによる装飾までを具体例付きで紹介します。"
tags: ["Hugo", "デザイン", "テンプレート", "ブログ構築"]
categories: ["開発ノート"]
---

## はじめに

これまでのブログ構築シリーズでは、

- 第 1 回：なぜ Hugo を選んだのか／システム構成
- 第 2 回：記事の作成〜反映手順（Hugo + GitHub + Xserver）
- 第 3 回：トップバーや本文のデザインカスタマイズ

と段階的に見てきました。

今回の第 4 回では、  
**ブログ一覧（/posts/）をカード型レイアウトにするテンプレート実装** を行います。

---

## 1. Hugo の一覧テンプレートの基本

Hugo では、URL とテンプレートが次のように対応しています。

- `/posts/` → `layouts/posts/list.html`
- （なければ `_default/list.html` を使用）

つまり、`layouts/posts/list.html` を作ることで  
**ブログ一覧を自由にデザインできる**ようになります。

---

## 2. カード型一覧テンプレートを作る

次のファイルを新規作成します：

```
layouts/posts/list.html
```

内容：

```go-html-template
{{/* layouts/posts/list.html */}}
{{ define "main" }}
<main class="main">
  <header class="page-header">
    <h1>{{ .Title }}</h1>
    {{ with .Params.description }}
      <p class="page-description">{{ . }}</p>
    {{ end }}
  </header>

  {{ $pages := where .Pages "Type" "posts" }}
  {{ $paginator := .Paginate $pages }}

  <section class="post-list">
    {{ range $paginator.Pages }}
    <article class="post-card">
      <a class="post-card-title" href="{{ .RelPermalink }}">
        {{ .Title }}
      </a>

      <div class="post-card-meta">
        <time datetime="{{ .Date.Format "2006-01-02" }}">
          {{ .Date.Format "2006-01-02" }}
        </time>
        {{ with .Params.tags }}
          <span class="post-card-tags">
            {{ range $i, $tag := . }}
              {{ if $i }}, {{ end }}{{ $tag }}
            {{ end }}
          </span>
        {{ end }}
      </div>

      {{ with .Summary }}
      <p class="post-card-summary">
        {{ . | plainify | truncate 120 }}
      </p>
      {{ end }}

      <div class="post-card-footer">
        <a class="post-card-readmore" href="{{ .RelPermalink }}">
          記事を読む →
        </a>
      </div>
    </article>
    {{ end }}
  </section>

  {{ partial "pagination.html" . }}
</main>
{{ end }}
```

---

## 3. カード用 CSS の追加

次を **`assets/css/extended/custom.css`** に追記します。

```css
.post-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.post-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 18px 18px 16px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
}

.post-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
  text-decoration: none;
}

.post-card-title:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.post-card-meta {
  margin-top: 6px;
  font-size: 0.85rem;
  color: #6b7280;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.post-card-tags {
  font-size: 0.8rem;
  color: #4b5563;
}

.post-card-summary {
  margin-top: 10px;
  font-size: 0.95rem;
  color: #4b5563;
}

.post-card-footer {
  margin-top: 14px;
}

.post-card-readmore {
  font-size: 0.9rem;
  color: #2563eb;
  text-decoration: none;
}

.post-card-readmore:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

---

## 4. ローカル確認

```bash
hugo server -D --ignoreCache -b http://localhost:1313/blog/
```

ブラウザで：

```
http://localhost:1313/blog/posts/
```

カード型一覧が表示されていれば OK です。

---

## 5. 公開

```bash
git add layouts/posts/list.html assets/css/extended/custom.css
git commit -m "feat: add card layout for posts list"
git push
```

---

## まとめ

この記事では、  
Hugo のテンプレート機能を使って **ブログ一覧をカード型レイアウトにする方法** を紹介しました。

- `layouts/posts/list.html` を作る
- `.Paginate` ＋ `.RelPermalink` で安全な一覧を生成
- カード用 CSS でデザインを整える

次回は **サムネ付きカード** や **おすすめ記事ブロック** など、  
より高度な一覧強化にも触れていきます。

---

Mirai Axis Blog

> デザインと技術の記録を積み重ねていきます。
