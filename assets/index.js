import {
  generateMaze,
  generateEmptyMaze,
  createCell,
} from './utilities.js'

const firstRun = (fr_cells, tp_cells) => {
  fr_cells.innerHTML = ""
  let fr_maze = generateMaze(20, 20);
  fr_maze.forEach((row, i) => {
    row.forEach((val, j) => {
      createCell(val, fr_cells, j, i, fr_maze);
    })
  })

  tp_cells.innerHTML = ""
  let tp_maze = generateMaze(20, 20);
  tp_maze.forEach((row, i) => {
    row.forEach((val, j) => {
      createCell(val, tp_cells, j, i, tp_maze);
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  
  const find_range_cells = document.querySelector('#find-range .cell-container');
  const find_range_maze = document.querySelector('#find-range button.new-maze');
  const find_range_empt = document.querySelector('#find-range button.make-empty')
  
  const two_point_cells = document.querySelector('#two-point .cell-container');
  const two_point_maze = document.querySelector('#two-point button.new-maze');
  const two_point_empt = document.querySelector('#two-point button.make-empty')

  firstRun(find_range_cells, two_point_cells);

  let fr_maze;
  let tp_maze;

  find_range_maze.addEventListener('click', () => {
    find_range_cells.innerHTML = ""
    fr_maze = generateMaze(20, 20);
    fr_maze.forEach((row, i) => {
      row.forEach((val, j) => {
        createCell(val, find_range_cells, j, i, fr_maze);
      })
    })
  })
  two_point_maze.addEventListener('click', () => {
    two_point_cells.innerHTML = ""
    tp_maze = generateMaze(20, 20);
    tp_maze.forEach((row, i) => {
      row.forEach((val, j) => {
        createCell(val, two_point_cells, j, i, tp_maze);
      })
    })
  })

  find_range_empt.addEventListener('click', () => {
    find_range_cells.innerHTML = ""
    fr_maze = generateEmptyMaze(20, 20);
    fr_maze.forEach((row, i) => {
      row.forEach((val, j) => {
        createCell(val, find_range_cells, j, i, fr_maze);
      })
    })
  })
  two_point_empt.addEventListener('click', () => {
    two_point_cells.innerHTML = ""
    fr_maze = generateEmptyMaze(20, 20);
    fr_maze.forEach((row, i) => {
      row.forEach((val, j) => {
        createCell(val, two_point_cells, j, i, fr_maze);
      })
    })
  })

});