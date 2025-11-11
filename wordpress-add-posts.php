<?php
/**
 * WordPress へ記事を一括追加するスクリプト
 * 
 * 使用方法:
 * 1. このファイルを WordPress のルートディレクトリに配置
 * 2. ブラウザで http://yoursite.com/wordpress-add-posts.php にアクセス
 * または
 * 2. WP-CLI で実行: wp plugin install wordpress-add-posts
 */

// WordPress を読み込む
require_once('wp-load.php');

// 管理者権限を確認
if (!current_user_can('manage_options')) {
    die('管理者権限が必要です。管理画面から実行してください。');
}

// サンプル記事データ
$sample_posts = [
    [
        'post_title' => '未病とは - セルフケアの実践知を学ぶ',
        'post_content' => <<<'HTML'
<h2>未病について</h2>
<p>未病（みびょう）とは、健康と病気の中間の状態のこと。東洋医学の考え方に基づいており、病気になる前に対策することの大切さを説いています。</p>

<h3>未病の三段階</h3>
<ol>
<li><strong>未病の初期段階</strong> - 自覚症状がない</li>
<li><strong>未病の中期段階</strong> - わずかな不調を感じる</li>
<li><strong>未病の進行段階</strong> - 明らかな不調が出ている</li>
</ol>

<h3>セルフケアの重要性</h3>
<p>日々の生活習慣を改善することで、未病の段階で対策することができます。</p>
<ul>
<li>バランスの良い食事</li>
<li>適切な運動</li>
<li>十分な睡眠</li>
<li>ストレス管理</li>
</ul>

<p>このウェブメディアでは、未病ケアの実践知をお届けします。</p>
HTML,
        'post_category' => ['未病とは'],
        'post_tags' => ['未病', 'セルフケア', '東洋医学'],
    ],
    [
        'post_title' => '毎日の食事で始める健康管理',
        'post_content' => <<<'HTML'
<h2>食事と健康の関係</h2>
<p>東洋医学では「医食同源」という考え方があります。これは食べ物も薬も源は同じということを意味します。</p>

<h3>季節ごとの食材選び</h3>
<p>季節の食材を意識することで、体を自然に調整できます。</p>

<h3>栄養バランス</h3>
<p>五色食べる習慣を取り入れることで、栄養バランスが整います。</p>
<ul>
<li>赤：トマト、人参</li>
<li>黄：かぼちゃ、卵</li>
<li>緑：ほうれん草、ブロッコリー</li>
<li>黒：ひじき、黒豆</li>
<li>白：大根、豆腐</li>
</ul>
HTML,
        'post_category' => ['毎日の食事'],
        'post_tags' => ['食事', '栄養', '医食同源'],
    ],
    [
        'post_title' => '運動の理屈 - なぜ体を動かすことが大切か',
        'post_content' => <<<'HTML'
<h2>運動と健康</h2>
<p>定期的な運動は、身体的・精神的な健康の基本です。</p>

<h3>運動がもたらす効果</h3>
<ul>
<li>血流改善</li>
<li>筋力維持</li>
<li>ストレス軽減</li>
<li>代謝向上</li>
<li>睡眠の質改善</li>
</ul>

<h3>無理のない運動習慣</h3>
<p>短時間でも継続することが大切です。毎日の軽いウォーキングも効果的です。</p>
HTML,
        'post_category' => ['運動の理屈'],
        'post_tags' => ['運動', '健康', 'フィットネス'],
    ],
    [
        'post_title' => '良質な睡眠がもたらす効果',
        'post_content' => <<<'HTML'
<h2>睡眠と健康</h2>
<p>睡眠は、身体と心の休息と回復の時間です。</p>

<h3>睡眠の質を高めるコツ</h3>
<ol>
<li>毎日同じ時間に就寝・起床する</li>
<li>就寝1時間前からスクリーン時間を減らす</li>
<li>寝室を暗く、涼しく保つ</li>
<li>就寝前のカフェイン摂取を避ける</li>
</ol>

<h3>睡眠時間の目安</h3>
<p>成人は1日7～8時間の睡眠が推奨されています。</p>
HTML,
        'post_category' => ['睡眠ナビ'],
        'post_tags' => ['睡眠', '休息', '健康'],
    ],
    [
        'post_title' => 'ストレス管理と瞑想',
        'post_content' => <<<'HTML'
<h2>ストレスと健康</h2>
<p>現代社会ではストレスは避けられません。重要なのはストレスとどう付き合うかです。</p>

<h3>瞑想のメリット</h3>
<ul>
<li>心を落ち着かせる</li>
<li>自律神経を整える</li>
<li>集中力向上</li>
<li>感情のコントロール</li>
</ul>

<h3>簡単な瞑想方法</h3>
<p>毎日5分から始めることができます。呼吸に意識を集中させるだけです。</p>
HTML,
        'post_category' => ['セルフケア'],
        'post_tags' => ['ストレス', '瞑想', 'メンタルヘルス'],
    ],
];

// 記事を挿入
$inserted_count = 0;
$error_messages = [];

foreach ($sample_posts as $post_data) {
    // 投稿を挿入
    $post_id = wp_insert_post([
        'post_title' => $post_data['post_title'],
        'post_content' => $post_data['post_content'],
        'post_status' => 'publish',
        'post_type' => 'post',
        'post_author' => get_current_user_id(),
    ]);

    if (is_wp_error($post_id)) {
        $error_messages[] = $post_data['post_title'] . ': ' . $post_id->get_error_message();
        continue;
    }

    // カテゴリーを設定
    if (!empty($post_data['post_category'])) {
        $category_ids = [];
        foreach ($post_data['post_category'] as $cat_name) {
            $category = get_term_by('name', $cat_name, 'category');
            if (!$category) {
                // カテゴリーが存在しない場合は作成
                $category = wp_insert_term($cat_name, 'category');
                if (!is_wp_error($category)) {
                    $category_ids[] = $category['term_id'];
                }
            } else {
                $category_ids[] = $category->term_id;
            }
        }
        if (!empty($category_ids)) {
            wp_set_post_categories($post_id, $category_ids);
        }
    }

    // タグを設定
    if (!empty($post_data['post_tags'])) {
        wp_set_post_tags($post_id, $post_data['post_tags']);
    }

    $inserted_count++;
}

// 結果を表示
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>記事追加完了</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .success {
            color: #27ae60;
            background-color: #d5f4e6;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .error {
            color: #c0392b;
            background-color: #fadbd8;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .info {
            color: #2980b9;
            background-color: #d6eaf8;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        h1 { color: #333; }
        a {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 4px;
        }
        a:hover { background-color: #2980b9; }
    </style>
</head>
<body>
    <div class="container">
        <h1>WordPress 記事追加スクリプト</h1>
        
        <?php if ($inserted_count > 0): ?>
            <div class="success">
                <strong>✓ 成功</strong><br>
                <strong><?php echo $inserted_count; ?></strong> 件の記事を追加しました。
            </div>
        <?php endif; ?>
        
        <?php if (!empty($error_messages)): ?>
            <div class="error">
                <strong>✗ エラー</strong><br>
                <?php foreach ($error_messages as $error): ?>
                    <p><?php echo esc_html($error); ?></p>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
        
        <?php if ($inserted_count === 0 && empty($error_messages)): ?>
            <div class="info">
                <strong>ℹ 情報</strong><br>
                追加する記事がありません。
            </div>
        <?php endif; ?>
        
        <div class="info">
            <strong>次のステップ:</strong>
            <ol>
                <li>WordPress 管理画面で記事を確認</li>
                <li>GraphQL エンドポイントで記事を取得できるか確認</li>
                <li>フロントエンドで記事が表示されるか確認</li>
            </ol>
        </div>
        
        <a href="<?php echo admin_url('edit.php'); ?>">記事一覧を確認</a>
    </div>
</body>
</html>
