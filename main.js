import '/style.css';
let $myCanva = document.getElementById('myGame');

const ctx = $myCanva.getContext('2d');

const BOARD_WIDTH = 14;
const BOARD_HEIGHT = 30;
const BLOCK_SIZE = 20;

$myCanva.width = BOARD_WIDTH * BLOCK_SIZE;
$myCanva.height = BOARD_HEIGHT * BLOCK_SIZE;

const PIECE_SELECTED  = {
  shape : [
    [1,1],
    [1,1]
  ],
  pos:{
    y: 0,
    x: Math.floor(BOARD_WIDTH / 2) - 1
  }
}


const PIECES = [
  {
    name: 'Square',
    shape: [
      [1,1],
      [1,1] 
    ]
  },
  {
    name: 'Line',
    shape: [
      [1],
      [1],
      [1],
      [1]
    ]
  },
  {
    name: 'T',
    shape: [
      [1,1,1],
      [0,1,0]
    ]
  },
  {
    name: 'L',
    shape: [
      [1,0],
      [1,0],
      [1,1]
    ]
  },
  {
    name: 'J',
    shape: [
      [0,1],
      [0,1],
      [1,1]
    ]
  },
  {
    name: 'S',
    shape: [
      [0,1,1],
      [1,1,0]
    ]
  },
  {
    name: 'Z',
    shape: [
      [1,1,0],
      [0,1,1]
    ]
  }
]

const nextPiece = PIECES[Math.floor(Math.random() * PIECES.length)]


const restartPiece = () =>{
  PIECE_SELECTED.pos.y = 0;
  PIECE_SELECTED.pos.x= Math.floor(BOARD_WIDTH / 2) - 1;
  PIECE_SELECTED.shape = nextPiece.shape;
  const newNextPiece = PIECES[Math.floor(Math.random() * PIECES.length)];
  nextPiece.name = newNextPiece.name;
  nextPiece.shape = newNextPiece.shape;

  if(board[PIECE_SELECTED.pos.y][PIECE_SELECTED.pos.x] === 1){
    alert('Game Over');
    board.forEach((row, i) => {
      board[i] = Array(BOARD_WIDTH).fill(0);
    })
  }
}

const board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));

const drawBoard = () => {
  for (let i = 0; i < BOARD_HEIGHT; i++) {
    for (let j = 0; j < BOARD_WIDTH; j++) {
      if (board[i][j] === 0) {
        ctx.fillStyle = '#f0f0f0';
      }else{
        ctx.fillStyle = '#000000';
      }
      ctx.fillRect(j * BLOCK_SIZE, i * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
  }
  for (let i = 0; i < PIECE_SELECTED.shape.length; i++) {
    for (let j = 0; j < PIECE_SELECTED.shape[i].length; j++) {
      if (PIECE_SELECTED.shape[i][j] === 1) {
        ctx.fillStyle = 'blue';
        ctx.fillRect((j + PIECE_SELECTED.pos.x) * BLOCK_SIZE, (i + PIECE_SELECTED.pos.y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
}

const initGame = () => {
  drawBoard();

  document.addEventListener('keydown', (e) => {

    if(e.key === 'ArrowUp'){
      rotatePiece();
      if(checkCollision()){
        rotatePiece();
        rotatePiece();
        rotatePiece();
      }
    }

    //with spacebar
    if(e.key === ' '){
      dropFull();
    }

    if (e.key === 'ArrowDown') {
      PIECE_SELECTED.pos.y++;
      if (checkCollision()) {
        PIECE_SELECTED.pos.y--;
        solidifyPiece()
      }
    }
    if (e.key === 'ArrowLeft') {
      PIECE_SELECTED.pos.x--;
      if (checkCollision()) {
        PIECE_SELECTED.pos.x++;
      }
    }
    if (e.key === 'ArrowRight') {
      PIECE_SELECTED.pos.x++;
      if (checkCollision()) {
        PIECE_SELECTED.pos.x--;
      }
    }
  })

  setInterval(update, 1);
  setInterval(moveShape, 500);

}

const dropFull = () =>{
  for (let i = 0; i < BOARD_HEIGHT; i++) {
    PIECE_SELECTED.pos.y++;
    if(checkCollision()){
      PIECE_SELECTED.pos.y--;
      solidifyPiece();
      break;
    }
  }
}

const solidifyPiece = ()=>{
  for (let i = 0; i < PIECE_SELECTED.shape.length; i++) {
    for (let j = 0; j < PIECE_SELECTED.shape[i].length; j++) {
      if (PIECE_SELECTED.shape[i][j] === 1) {
        board[i + PIECE_SELECTED.pos.y][j + PIECE_SELECTED.pos.x] = 1;
      }
    }
  }
  restartPiece();
}


const rotatePiece = () =>{
  let newShape = [];
  for (let i = 0; i < PIECE_SELECTED.shape[0].length; i++) {
    let newRow = [];
    for (let j = 0; j < PIECE_SELECTED.shape.length; j++) {
      newRow.push(PIECE_SELECTED.shape[PIECE_SELECTED.shape.length - 1 - j][i]);
    }
    newShape.push(newRow);
  }
  PIECE_SELECTED.shape = newShape;

}

const checkCollision = () => {
  for (let i = 0; i < PIECE_SELECTED.shape.length; i++) {
    for (let j = 0; j < PIECE_SELECTED.shape[i].length; j++) {
      if (
        PIECE_SELECTED.shape[i][j] === 1 &&
        (board[i + PIECE_SELECTED.pos.y] === undefined || board[i + PIECE_SELECTED.pos.y][j + PIECE_SELECTED.pos.x] === undefined || board[i + PIECE_SELECTED.pos.y][j + PIECE_SELECTED.pos.x] === 1)
      ) {
        return true;
      }
    }
  }
  return false;
}

const checkLine = () =>{
  for (let i = 0; i < BOARD_HEIGHT; i++) {
    if(board[i].every((cell) => cell === 1)){
      board.splice(i, 1);
      board.unshift(Array(BOARD_WIDTH).fill(0));
    }
  }
}

const moveShape = () =>{
  PIECE_SELECTED.pos.y++;
  if(checkCollision()){
    PIECE_SELECTED.pos.y--;
    solidifyPiece();
  }
}

const update = () =>{
  drawBoard();
  checkLine();
}

initGame();