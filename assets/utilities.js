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
function neighborAlgo(coords, parentID) {
  let nCoords = [];

  let [x, y] = coords.split('.');
  x = Number(x);
  y = Number(y);

  const curr = document.querySelector(`#${parentID} .cell-container div.x${x}y${y}`);
  curr.classList.add('checked');

  [x - 1, x, x + 1].forEach(el => {
    let left = document.querySelector(`#${parentID} .cell-container .path.x${el}y${y + 1}`);
    if (left) nCoords.push(`${el}.${y - 1}`);
    let mid = document.querySelector(`#${parentID} .cell-container .path.x${el}y${y}`);
    if (mid) nCoords.push(`${el}.${y}`);
    let right = document.querySelector(`#${parentID} .cell-container .path.x${el}y${y - 1}`);
    if (right) nCoords.push(`${el}.${y + 1}`);
  })
  return Array.from(nCoords);
}

const sleep = delay => new Promise(res => setTimeout(res, delay));

export async function bft(coords, parentID) {
  let [x, y] = coords.split('.');
  const curr = document.querySelector(`#${parentID} .cell-container div.x${x}y${y}`);
  curr.classList.add('origin');

  let seen = new Set([coords]);
  let queue = [coords];

  while (queue.length) {
    let neighbors = getNeighbors(queue.shift(), parentID);
    neighbors = neighbors.sort();
    await sleep(100);
    neighbors.forEach(coord => {
      if (!seen.has(coord)) {
        seen.add(coord);
        queue.push(coord);
      }
    })
  }
}
export async function dfs(start, end, parentID) {
  // const parent = start.parentNode.parentNode.id;
  const [s_x, s_y] = start.split('.');
  const [e_x, e_y] = end.split('.');
  let startNode = document.querySelector(`#${parentID} .cell-container div.x${s_x}y${s_y}`);
  let endNode = document.querySelector(`#${parentID} .cell-container div.x${e_x}y${e_y}`);
  startNode.classList.add('origin');
  endNode.classList.add('end-point');

  // console.log('Start: ', startNode);
  // console.log('End: ', endNode);

  let seen = new Set([start]);
  let unseen = new Set()
  let queue = [start];

  while (queue.length) {
    let neighbors = getNeighbors(queue.pop(), parentID);
    if (e_x <= s_x) {
      neighbors.sort()
    } else {
      neighbors.sort().reverse();
    }
    await sleep(100);
    neighbors.sort((a, b) => {
      let [a_x, a_y] = a.split('.');
      let [b_x, b_y] = b.split('.');

      const distance = (n_x, n_y) => Math.sqrt( (Math.abs(e_x - n_x)**2) + (Math.abs(e_y - n_y)**2));

      return distance(b_x, b_y) - distance(a_x, a_y);
    })
    neighbors.forEach(coord => {
      if (end == coord) queue = [];
      if (!seen.has(coord)) {
        seen.add(coord);
        queue.push(coord);
      }
    })
  }
}

function tp_closure() {
  let clickCount = 0;
  let first;
  let second;

  async function inner(node) {
    clickCount++;
    let cells = document.querySelectorAll('.path');
    cells.forEach(cell => {
      cell.classList.remove('checked');
      cell.classList.remove('origin');
      cell.classList.remove('end-point');
    })

    let classes;
    let selector = '';

    if (node.target.classList.contains('x') || node.target.classList.contains('y')) {
      classes = node.target.parentNode.classList.value;
    } else if (node.target.classList.contains('path')) {
      classes = node.target.classList.value;
    }

    function getCoords(str) {
      str = str.split('y');
      return `${str[0].split('x')[1]}.${str[1]}`;
    }
    classes = classes.split(' ')[1];
    selector = getCoords(classes);

    if (clickCount % 2) {
      first = selector;
    } else {
      second = selector;
      await dfs(first, second, 'two-point');
    }

    return inner;
  }

  return inner;
}
let tp_cb = tp_closure();

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

    let fr_cb = async (e) => {
      let cells = document.querySelectorAll('.path');
      cells.forEach(cell => {
        cell.classList.remove('checked');
        cell.classList.remove('origin');
      })
      await bft(`${x}.${y}`, parent.parentNode.id);
    }

    if (parent.parentNode.id == 'find-range') cell.addEventListener('click', (e) => { fr_cb(e) });
    if (parent.parentNode.id == 'two-point') {
      cell.classList.add('infinite');
      cell.addEventListener('click', (e) => { tp_cb(e) })
    }
    parent.appendChild(cell);
  }
}