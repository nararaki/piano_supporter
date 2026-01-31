# CLAUDE.md

このファイルはClaude Codeがこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

ピアノ教育支援アプリケーション。生徒が演奏動画を投稿し、講師がフィードバックを提供するプラットフォーム。

## 設計方針

### エラーハンドリング: Result型パターン

このプロジェクトでは、HTTPステータスコードではなく、アプリケーションレベルのResult型でエラーを扱う。

```typescript
// すべてのAPIレスポンスは200 OKを返し、Result型で成功/失敗を判定
type Result<T> = { ok: true; value: T } | { ok: false; error: AppError };
```

**意図:**
- フロントエンドで統一的に `result.ok` で分岐できる
- Server Actions や actionError パターンとの親和性
- エラー型が `AppError` として型安全に統一される

**実装例:**
```typescript
// サーバー側
if (!result.ok) {
    return c.json(result, 200);  // 意図的に200を返す
}

// クライアント側
const result = await api.createPost(data);
if (!result.ok) {
    showError(result.error.message);
    return;
}
```

### アーキテクチャ

- **レイヤードアーキテクチャ**: Interface → Service → Repository → Infrastructure
- **依存性注入**: サービスはコンストラクタでリポジトリを受け取る
- **ドメインモデル**: `packages/common/domains` にエンティティとファクトリ関数を配置
- **Branded Type**: `AccountId`, `Email` などプリミティブ型の混同を防止

## コマンド

```bash
# 開発サーバー起動
npm run dev

# データベース起動
docker-compose up -d
```

## ディレクトリ構成

```
apps/
  client/     # Next.js フロントエンド
  server/     # Hono API サーバー
packages/
  common/     # 共有型・ドメイン・ユーティリティ
```
