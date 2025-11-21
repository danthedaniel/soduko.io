// @ts-check
"use strict";

/**
 * @typedef {Object} Coords
 * @property {number} col
 * @property {number} row
 */

// Use 0 for open cells.
/** @type {number[][]} */
const puzzle = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

const board = /** @type {HTMLDivElement} */ (document.querySelector("#board"));
loadPuzzle(board, puzzle);

const cells = document.querySelectorAll("input");
for (const cell of cells) {
  cell.onkeydown = (event) => cellKeyDown(cell, event);
}

const verifyButton = /** @type {HTMLButtonElement} */ (
  document.getElementById("check")
);
verifyButton.onclick = () => validate(board);

/**
 * @param {HTMLInputElement} cell
 * @param {KeyboardEvent} event
 */
function cellKeyDown(cell, event) {
  event.preventDefault();

  switch (event.key) {
    case "Backspace":
    case "Delete":
      if (cell.readOnly) {
        return;
      }

      cell.value = "";

      const newCell = prevOpenCell(board, cell);
      newCell.focus();
      return;
    case "ArrowUp": {
      const coords = getCoords(board, cell);
      if (coords.row === 0) {
        return;
      }

      const newCell = getCell(board, {
        col: coords.col,
        row: coords.row - 1,
      });
      newCell.focus();
      return;
    }
    case "ArrowDown": {
      const coords = getCoords(board, cell);
      if (coords.row === 8) {
        return;
      }

      const newCell = getCell(board, {
        col: coords.col,
        row: coords.row + 1,
      });
      newCell.focus();
      return;
    }
    case "ArrowLeft": {
      const coords = getCoords(board, cell);
      if (coords.col === 0) {
        return;
      }

      const newCell = getCell(board, {
        col: coords.col - 1,
        row: coords.row,
      });
      newCell.focus();
      return;
    }
    case "ArrowRight": {
      const coords = getCoords(board, cell);
      if (coords.col === 8) {
        return;
      }

      const newCell = getCell(board, {
        col: coords.col + 1,
        row: coords.row,
      });
      newCell.focus();
      return;
    }
    case "Enter": {
      const newCell = nextOpenCell(board, cell);
      newCell.focus();
      return;
    }
    case "Tab": {
      const newCell = event.shiftKey
        ? prevOpenCell(board, cell)
        : nextOpenCell(board, cell);
      newCell.focus();
      return;
    }
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9": {
      if (cell.readOnly) {
        return;
      }

      cell.value = event.key;
      const newCell = nextOpenCell(board, cell);
      newCell.focus();
      return;
    }
  }
}

/**
 * @param {HTMLDivElement} board
 * @param {number[][]} puzzle
 */
function loadPuzzle(board, puzzle) {
  for (let col = 0; col < 9; col++) {
    for (let row = 0; row < 9; row++) {
      const value = puzzle[row][col];
      const cell = getCell(board, { col, row });
      cell.classList.remove("error");

      if (value === 0) {
        cell.value = "";
        cell.readOnly = false;
      } else {
        cell.value = value.toString();
        cell.readOnly = true;
      }
    }
  }
}

/**
 * @param {HTMLDivElement} board
 * @param {HTMLInputElement} cell
 * @returns {Coords} Coordinates
 */
function getCoords(board, cell) {
  for (let col = 0; col < 9; col++) {
    for (let row = 0; row < 9; row++) {
      if (getCell(board, { col, row }) === cell) {
        return { col, row };
      }
    }
  }

  throw new Error("Could not find coordinates of cell");
}

/**
 * @param {HTMLDivElement} board
 * @param {Coords} coords
 * @returns {HTMLInputElement}
 */
function getCell(board, coords) {
  const groupRow = Math.floor(coords.row / 3);
  const groupCol = Math.floor(coords.col / 3);
  const groups = Array.from(board.querySelectorAll("div"));
  const group = groups[groupRow * 3 + groupCol];

  const cellRow = coords.row % 3;
  const cellCol = coords.col % 3;
  const groupCells = Array.from(group.querySelectorAll("input"));

  return groupCells[cellRow * 3 + cellCol];
}

/**
 * @param {HTMLDivElement} board
 * @param {HTMLInputElement} cell
 */
function nextOpenCell(board, cell) {
  const originalCell = cell;

  while (true) {
    cell = getCell(board, nextCoords(board, cell));
    if (cell.readOnly) {
      continue;
    }
    // Prevent infinite loops
    if (cell === originalCell) {
      return originalCell;
    }

    return cell;
  }
}

/**
 * @param {HTMLDivElement} board
 * @param {HTMLInputElement} cell
 */
function prevOpenCell(board, cell) {
  const originalCell = cell;

  while (true) {
    cell = getCell(board, prevCoords(board, cell));
    if (cell.readOnly) {
      continue;
    }
    // Prevent infinite loops
    if (cell === originalCell) {
      return originalCell;
    }

    return cell;
  }
}

/**
 * @param {HTMLDivElement} board
 * @param {HTMLInputElement} cell
 * @returns {Coords}
 */
function nextCoords(board, cell) {
  const coords = getCoords(board, cell);
  if (coords.col < 8) {
    return { col: coords.col + 1, row: coords.row };
  }

  if (coords.row < 8) {
    return { col: 0, row: coords.row + 1 };
  }

  return { col: 0, row: 0 };
}

/**
 * @param {HTMLDivElement} board
 * @param {HTMLInputElement} cell
 * @returns {Coords}
 */
function prevCoords(board, cell) {
  const coords = getCoords(board, cell);
  if (coords.col > 0) {
    return { col: coords.col - 1, row: coords.row };
  }

  if (coords.row > 0) {
    return { col: 8, row: coords.row - 1 };
  }

  return { col: 8, row: 8 };
}

/**
 * @param {HTMLDivElement} board
 * @param {number} col Must be integer within 0..8
 * @returns {HTMLInputElement[]}
 */
function getCol(board, col) {
  /** @type {HTMLInputElement[]} */
  const rowCells = [];

  for (let row = 0; row < 9; row++) {
    rowCells.push(getCell(board, { col, row }));
  }

  return rowCells;
}

/**
 * @param {HTMLDivElement} board
 * @param {number} row Must be integer within 0..8
 * @returns {HTMLInputElement[]}
 */
function getRow(board, row) {
  /** @type {HTMLInputElement[]} */
  const rowCells = [];

  for (let col = 0; col < 9; col++) {
    rowCells.push(getCell(board, { col, row }));
  }

  return rowCells;
}

/**
 * @param {HTMLDivElement} board
 * @param {number} group Must be an integer within 0..8
 * @returns {HTMLInputElement[]}
 */
function getGroup(board, group) {
  /** @type {HTMLDivElement[]} */
  const groups = Array.from(board.querySelectorAll("div"));
  return Array.from(groups[group].querySelectorAll("input"));
}

/**
 * @param {HTMLInputElement[]} cells
 */
function markError(cells) {
  for (const cell of cells) {
    cell.classList.add("error");
  }
}

/**
 * @param {HTMLInputElement[]} cells
 */
function clearError(cells) {
  for (const cell of cells) {
    cell.classList.remove("error");
  }
}

/**
 * Validate the board is completed.
 * @param {HTMLDivElement} board
 */
function validate(board) {
  let valid = true;

  for (let i = 0; i < 9; i++) {
    const row = getRow(board, i);
    if (!validateCells(row)) {
      markError(row);
      valid = false;
    }

    const col = getCol(board, i);
    if (!validateCells(col)) {
      markError(col);
      valid = false;
    }

    const group = getGroup(board, i);
    if (!validateCells(group)) {
      markError(group);
      valid = false;
    }
  }

  return valid;
}

/**
 * Validate a group of cells
 * @param {HTMLInputElement[]} cells
 * @returns {boolean}
 */
function validateCells(cells) {
  const numbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (const cell of cells) {
    const digit = parseInt(cell.value);
    if (isNaN(digit)) {
      return false;
    }

    numbers.delete(digit);
  }

  return numbers.size === 0;
}
