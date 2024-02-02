export function generateMaze(row = 10, col = 10) {
  let maze = [];

  for (let i = 0; i < row; i++) {
    let row = [];
    for (let j = 0; j < col; j++) {
      let val = Math.floor(Math.random() * 2);
      row.push(val);
    }
    maze.push(row);
  }

  return maze;
}
export function generateEmptyMaze(row = 10, col = 10) {
  let maze = [];

  for (let i = 0; i < row; i++) {
    let row = [];
    for (let j = 0; j < col; j++) {
      row.push(0);
    }
    maze.push(row);
  }

  return maze;
}

function getNeighbors(coords, parentID) {
  let nCoords = new Set();

  let [x, y] = coords.split('.');
  x = Number(x);
  y = Number(y);

  const curr = document.querySelector(`#${parentID} .cell-container div.x${x}y${y}`);
  curr.classList.add('checked');

  [x - 1, x, x + 1].forEach(el => {
    let left = document.querySelector(`#${parentID} .cell-container .path.x${el}y${y - 1}`);
    if (left) nCoords.add(`${el}.${y - 1}`);
    let mid = document.querySelector(`#${parentID} .cell-container .path.x${el}y${y}`);
    if (mid) nCoords.add(`${el}.${y}`);
    let right = document.querySelector(`#${parentID} .cell-container .path.x${el}y${y + 1}`);
    if (right) nCoords.add(`${el}.${y + 1}`);
  })
  return Array.from(nCoords);
}

const sleep = delay => new Promise(res => setTimeout(res, delay));

// FLOOD IS A BF-TRAVERSAL ALGO
export async function bft(coords, parentID) {
  let [x, y] = coords.split('.');
  const curr = document.querySelector(`#${parentID} .cell-container div.x${x}y${y}`);
  curr.classList.add('origin');

  let seen = new Set([coords]);
  let stack = [coords];

  while (stack.length) {
    let neighbors = getNeighbors(stack.shift(), parentID);
    await sleep(100);
    neighbors.forEach(coord => {
      if (!seen.has(coord)) {
        seen.add(coord);
        stack.push(coord);
      }
    })
  }

}

export function createCell(val, parent, x, y) {
  let cell = document.createElement('div');
  cell.innerHTML = `<span class='x'>${x}</span><span class='y'>${y}</span>`
  cell.classList.add('cell');
  cell.classList.add(`x${x}y${y}`);

  if (val) {
    cell.classList.add('wall');
    parent.appendChild(cell);
  } else {
    cell.classList.add('path');

    let cb = async (e) => {
      let cells = document.querySelectorAll('.path');
      cells.forEach(cell => {
        cell.classList.remove('checked');
        cell.classList.remove('origin');
      })
      await bft(`${x}.${y}`, parent.parentNode.id);
    }
    if (parent.parentNode.id == 'find-range') cell.addEventListener('click', (e) => { cb(e) });
    parent.appendChild(cell);
  }
}