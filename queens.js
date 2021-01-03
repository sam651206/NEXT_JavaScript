/* file: queens.js
 sam 20210103
*/
let Queen = 1;
let Empty = 0;

function makeArray(rows, cols, value) {
  let rowss = [];
  for (let row = 0; row < rows; row++) {
    let oneRow = [];
    for (let col = 0; col < cols; col++)
      oneRow[col] = Empty;
    rowss[row] = oneRow;
  }
  return rowss;
}

// 初始化陣列8x8 值為空
function initialModel() {
  let board = makeArray(8, 8, Empty);
  let topLeft = {row:0, col:0};
  let model = {
          position: topLeft,
          board: board,
          memory: [],
          solved: false
        };
  return model;
}

// 啟始於 {row:0, col:0}; 停在 {row:8, col:0}
function next (position) {
  if (position.col < 7)
    return {row : position.row, col : position.col + 1};
  else
    return {row : position.row + 1, col : 0};
}

// 開始觸發尋找位置 觸發順序: position -> position -> board -> bool
function attacksFromAbove(pos1, pos2, board) {
  let hasAQueen  = board[pos1.row][pos1.col] == Queen;
  let sameColumn = pos1.col == pos2.col;
  let onDiagonal = (Math.abs(pos1.row - pos2.row)) ==
    (Math.abs(pos1.col - pos2.col));
  return (hasAQueen && (sameColumn || onDiagonal));
}

// 觸發後設置顏色
function isAttacked(position, board) {
  for (let row = 0; row < position.row; row++)
    for (let col = 0; col < board[0].length; col++) {
      let pos = {row:row, col:col};
      if (attacksFromAbove(pos, position, board))
        return true;
    }
  return false;
}

// 確定後設置queens顏色
function makeSquare(model, row, col) {
  let div = document.createElement("div");
  div.className = "inner";
  let color = ((row + col) % 2) == 0 ?  "#d0d0d0" : "#7F7F7F";
  div.style.background = color;
  if (model.board[row][col] == Queen)
    div.style.background = "red";
  return div;
}

//Render其他顏色
function view(model) {
  let main = document.createElement('div');
  main.className = "main";
  for(let row = 0; row < 8; row++)
    for(let col = 0; col < 8; col++) {
      let square = makeSquare(model, row, col);
      main.appendChild(square);
    }
  return main;
}
//定義位置
function p2s(position) {
  return "(" + position.row + ", " + position.col + ")";
}
//把個功能整合
function update (model) {
  let board = model.board;
  let memory = model.memory;

  let solve = function (position) {
    if (position.row == 8) {
      model.solved = true;
      return model;
    }
    if (isAttacked(position, board)) {
      if (position.col < 7) {
        position.col = position.col + 1;
        return solve(position);
      }
      else
        return backTrack(model);
      }
    else {
        board[position.row][position.col] = Queen;
        console.log("settled on:" + p2s(position));
        memory.push(position);
        model.position = {row:position.row + 1, col:0};
        return model;
      }
    }

  let backTrack = function (model) {
    if (model.memory == []) {
      throw 0;
    }
    else {
      let formerPos = model.memory.pop();
	    model.board[formerPos.row][formerPos.col] = Empty;
	    if (formerPos.col == 7)
        return backTrack(model);
      else
        return solve(next(formerPos));
      }
    }
  return solve(model.position);
}

// 開始執行
function start(app) {
  let model = initialModel();
  let interval = setInterval(function () {
    if (app.done(model)) {
      clearInterval(interval);
      return 0;
    }
    else {
      let element = app.view(model);
      let main = document.getElementsByClassName('main')[0];
      document.body.removeChild(main);
      document.body.appendChild(element);
      model = app.update(model);
    }
  }, app.interval);
}
//綁定事件監聽觸發
function launch(app) {
  document.body.addEventListener("click",
    function (event) { start(app); });
}

let queens =
  {
    view: view,
    update: update,
    done: (model => model.solved),
    interval : 10
  }

function go () { launch(queens); }
