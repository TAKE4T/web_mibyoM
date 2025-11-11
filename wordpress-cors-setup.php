<?php
/**
 * WordPress CORS設定
 *
 * このコードをWordPressのfunctions.phpに追加してください
 * テーマディレクトリ: /wp-content/themes/[your-theme]/functions.php
 */

// REST APIのCORS設定
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        // 本番環境では、特定のドメインのみ許可することを推奨
        // 開発時は '*' を使用
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        return $value;
    });
}, 15);

// WordPressのREST APIエンドポイントを有効化（通常はデフォルトで有効）
add_filter('rest_authentication_errors', function($result) {
    // すでにエラーがある場合はそのまま返す
    if (!empty($result)) {
        return $result;
    }

    // 認証なしでREST APIにアクセスを許可
    return true;
});

/**
 * Vercel本番環境用のCORS設定（セキュリティ強化版）
 *
 * 使用方法:
 * 1. 下記コードのコメントを外す
 * 2. 'https://your-vercel-domain.vercel.app' を実際のVercelドメインに変更
 */
/*
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        $allowed_origins = [
            'http://localhost:3000',  // ローカル開発用
            'https://mibyo.otemae-osu.com',  // 本番カスタムドメイン
            'https://your-vercel-domain.vercel.app',  // Vercel プレビュー
        ];

        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Headers: Content-Type, Authorization');
        }

        return $value;
    });
}, 15);
*/
?>
