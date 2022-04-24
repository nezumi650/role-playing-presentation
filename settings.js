// １度に移動する距離(px)
const HOHABA_PX = 20;

// アバター画像の横幅(px)
const AVATAR_WIDTH = 50;
const AVATAR_HEIGHT = 70;

// コンテンツの大きさ(px)
const CONTAINER_HEIGHT = 500;
const CONTAINER_WIDTH = 700;

const MIN_LEFT_CONTAINER = 10;
const MAX_LEFT_CONTAINER = CONTAINER_WIDTH - AVATAR_WIDTH -10; // アバターの右恥が壁にうまるため微調整
const MIN_TOP_CONTAINER = 0;
const MAX_TOP_CONTAINER = CONTAINER_HEIGHT - AVATAR_HEIGHT;

// 廊下の縦幅(px)
const MIN_TOP_ROUKA = 130;
const MAX_TOP_ROUKA = 330;

// ページ送り
const PrevPageKey = 'p'; //前のページを表示
const NextPageKey = 'n'; //次のページを表示

// 背景画像
// 部屋番号(0始まり): 画像名
const BACKGROUND_IMAGES = {
  1: 'park.png',
  3: 'sample.png',
  4: 'hondana.png'
};

// 絵文字アクション
const EMOJIS = {
  'c': "hakusyu.gif",
  'h': "hello.png",
  'i': "iine.png",
  'k': "konnitiha.png"
};
