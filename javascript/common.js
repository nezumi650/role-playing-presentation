'use strict';

const avatar = document.getElementById('avatar');
const container = document.getElementById('container');

const rooms = container.innerHTML.split('<!--next-->');
const MAX_ROOM_NUM = rooms.length - 1;

let currentRoomNum = 0;
let currentPageNum = 0;

// アバターの初期位置
avatar.style.top = MIN_TOP_CONTAINER;
avatar.style.left = MIN_LEFT_CONTAINER;

buildRoom();

// 部屋の描写
function buildRoom() {
  // 初期化
  currentPageNum = 0;
  container.innerHTML = '';
  container.style.display = 'flex';

  document.getElementById('pageNavi').innerHTML = `${currentRoomNum + 1}/${rooms.length}`;
  setBackgroundImage();
  buildPages();
  paging();
}

function buildPages() {
  const pages = rooms[currentRoomNum].split(/(?=\n## )/g);
  for (let i = 0; i < pages.length; i++) {
    if (!pages[i].trim()) {
      return;
    }
    const pageDiv = document.createElement('div');
    pageDiv.className = 'pages';
    pageDiv.style.display = 'none';
    pageDiv.innerHTML = marked.parse(pages[i]);
    container.appendChild(pageDiv);
  }
}

function setBackgroundImage() {
  // 個別の設定があればそれを使う
  if (BACKGROUND_IMAGES[currentRoomNum]) {
    container.style.backgroundImage = `url('./images/maps/${BACKGROUND_IMAGES[currentRoomNum]}')`;
    return;
  }

  let mapImage;
  switch (currentRoomNum) {
    case 0:
      mapImage = 'start.png';
      break;
    case MAX_ROOM_NUM:
      mapImage = 'last.png';
      break;
    default:
      mapImage = 'normal.png';
      break;
  }
  container.style.backgroundImage = `url('./images/maps/${mapImage}')`;
}

// ページ送り
function paging(nextPageNum = 0) {
  const pages = document.getElementsByClassName('pages');
  currentPageNum = Math.min(Math.max(0, nextPageNum), pages.length - 1);

  for (let i = 0; i < pages.length; i++) {
    if (i === currentPageNum) {
      pages[i].style.display = 'flex';
    } else {
      pages[i].style.display = 'none';
    }
  }
}

// アバター画像の変更
function setAvatarImage(imageFile) {
  const backgroundImage = imageFile.match(/url/)
    ? imageFile
    : `url('./images/avatar/${imageFile || 'right.png'}')`;
  avatar.style.backgroundImage = backgroundImage;
}

// 縦方向の移動
function walkTate(top) {
  setAvatarImage(avatar.style.backgroundImage.replace('png', 'gif'));
  let nextTopPx = avatar.style.top.replace('px', '') * 1 + top;

  nextTopPx =
    0 < top
      ? Math.min(nextTopPx, MAX_TOP_CONTAINER)
      : Math.max(nextTopPx, MIN_TOP_CONTAINER);
  avatar.style.top = nextTopPx + 'px';

  // 壁に当たる場合の考慮
  if (isRouka(nextTopPx)) {
    // 廊下の場合は考慮不要
    return;
  }

  const currentLeftPx = avatar.style.left.replace('px', '') * 1;
  if (currentLeftPx < MIN_LEFT_CONTAINER) {
    avatar.style.left = MIN_LEFT_CONTAINER + 'px';
  } else if (MAX_LEFT_CONTAINER < currentLeftPx) {
    avatar.style.left = MAX_LEFT_CONTAINER + 'px';
  }
}

function isRouka(topPx) {
  return MIN_TOP_ROUKA <= topPx && topPx <= MAX_TOP_ROUKA;
}

// 横方向の移動
function walkYoko(left) {
  const currentTopPx = avatar.style.top.replace('px', '') * 1;
  let nextLeftPx = avatar.style.left.replace('px', '') * 1 + left;

  if (0 < left) {
    setAvatarImage('right.gif');
    if (currentRoomNum === MAX_ROOM_NUM || !isRouka(currentTopPx)) {
      nextLeftPx = Math.min(nextLeftPx, MAX_LEFT_CONTAINER);
    }
  } else if (left < 0) {
    setAvatarImage('left.gif');
    if (currentRoomNum === 0 || !isRouka(currentTopPx)) {
      nextLeftPx = Math.max(nextLeftPx, MIN_LEFT_CONTAINER);
    }
  }
  avatar.style.left = nextLeftPx + 'px';

  // 画面送り
  if (nextLeftPx < 0) {
    avatar.style.left = MAX_LEFT_CONTAINER;
    currentRoomNum--;
    buildRoom();
  } else if (MAX_LEFT_CONTAINER < nextLeftPx) {
    avatar.style.left = MIN_LEFT_CONTAINER;
    currentRoomNum++;
    buildRoom();
  }
}

// キーボード操作
document.addEventListener(
  'keydown',
  function (event) {
    switch (event.key) {
      // 移動
      case 'ArrowUp':
        walkTate(HOHABA_PX * -1);
        break;
      case 'ArrowDown':
        walkTate(HOHABA_PX);
        break;
      case 'ArrowLeft':
        walkYoko(HOHABA_PX * -1);
        break;
      case 'ArrowRight':
        walkYoko(HOHABA_PX);
        break;

      // 画面送り
      case '<':
        currentRoomNum = Math.max(0, currentRoomNum - 1);
        buildRoom();
        break;
      case '>':
        currentRoomNum = Math.min(MAX_ROOM_NUM, currentRoomNum + 1);
        buildRoom();
        break;

      // ページ送り
      case PrevPageKey:
        paging(currentPageNum - 1);
        break;
      case NextPageKey:
        paging(currentPageNum + 1);
        break;

      default:
        // do nothing
    }
  },
  false
);
document.addEventListener(
  'keyup',
  function () {
    setAvatarImage(avatar.style.backgroundImage.replace('gif', 'png'));
  },
  false
);
