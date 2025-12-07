export type FeaturePlacement = 'top' | 'deep' | 'both';

export type FeatureItem = {
  slug: string;
  title: string;
  description?: string;
  placement: FeaturePlacement;
  order?: number;
  visible?: boolean;
};

export const FEATURED: FeatureItem[] = [
  { slug: 'everyday-meals', title: '毎日の食事', description: '症状別で選ぶ理想の食事とレシピ', placement: 'top', order: 1, visible: true },
  { slug: 'exercise-principles', title: '運動の理屈', description: '目的別の運動計画と体の使い方', placement: 'top', order: 2, visible: true },
  { slug: 'sleep-navigation', title: '睡眠ナビ', description: '悩み別の休息アプローチ', placement: 'top', order: 3, visible: true },
  { slug: 'wa-kan-steam', title: '和韓蒸しとは', description: '蒸気療法と巡りケアの最前線', placement: 'top', order: 4, visible: true },
  { slug: 'scalp-care', title: '頭皮ケア特集', description: '髪の変化を生む頭皮環境の整え方', placement: 'top', order: 5, visible: true },
  { slug: 'skin-care', title: '肌ケアとは', description: 'お肌を守る最新の素材と成分', placement: 'top', order: 6, visible: true },
  { slug: 'diet-metabolism', title: 'ダイエットと代謝の実践ガイド', description: '体重管理と代謝を整える実践ガイド', placement: 'deep', order: 1, visible: true },
  { slug: 'gut-brain-health', title: '腸活ブームを振り返る', description: '腸脳相関を流行で終わらせない', placement: 'deep', order: 2, visible: true },
  { slug: 'stem-cell-frontier', title: '幹細胞治療最前線', description: '細胞を目覚めさせる医療のいま', placement: 'deep', order: 3, visible: true },
  { slug: 'coffee-science', title: 'コーヒー豆を科学する', description: '焙煎と産地で叶える体調別ブレンド', placement: 'deep', order: 4, visible: true },
];

export default FEATURED;
