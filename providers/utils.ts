export enum ItemObjectStatus {
  Hidden = 0,
  Flagged = 1,
  Revealed = 2,
}
export type ItemObject = { isBomb: boolean, nextBombsCount: number; status: ItemObjectStatus };
export type GridObject = ItemObject[][];

// Create a blank grid and return a ranom number of bombs
export function createBlankGrid(row: number, col: number): { grid: GridObject, numBombs: number } {
  const grid = new Array(col).fill(null).map(
    () => new Array(row).fill(null).map(() => ({
      isBomb: false,
      nextBombsCount: 0,
      status: ItemObjectStatus.Hidden,
    })),
  );
  const max = Math.floor(row * col / 6);
  const min = Math.floor(max / 1.5);
  const numBombs = Math.floor(Math.random() * (max - min + 1)) + min;
  return { grid, numBombs };
}

// Place num bombs on the grid, depending on the first move played
function placeBombs(grid: GridObject, num: number, xFirst: number, yFirst: number) {
  const col = grid.length;
  const row = grid[0].length;
  while (num > 0) {
    const y = Math.floor(Math.random() * col);
    const x = Math.floor(Math.random() * row);
    if (grid[y][x].isBomb === false && !(x === xFirst && y === yFirst)) {
      grid[y][x].isBomb = true;
      num--;
    }
  }
  return grid;
}

// Get the number of bombs next to the box at the position (x, y)
function countNextBombs(grid: GridObject, x: number, y: number) {
  let count = 0;
  for (let j = -1; j <= 1; j++) {
    for (let i = -1; i <= 1; i++) {
      if ((j + y >= 0) && (i + x >= 0) && (j + y < grid.length) && (i + x < grid[0].length)) {
        if (grid[j + y][i + x].isBomb) count += 1;
      }
    }
  }
  return count;
}

// Setup the grid with bombs considering the first move played
export function setupGrid(grid: GridObject, num: number, xFirst: number, yFirst: number) {
  grid = placeBombs(grid, num, xFirst, yFirst);
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (!grid[y][x].isBomb) grid[y][x].nextBombsCount = countNextBombs(grid, x, y)
    }
  }
  return grid;
}

// Handle the case where 0 bombs surround the box at (x, y) by recursively revealing the boxes next to it
export function handle0Bomb(grid: GridObject, x: number, y: number) {
  for (let j = -1; j <= 1; j++) {
    for (let i = -1; i <= 1; i++) {
      if ((j + y >= 0) && (i + x >= 0) && (j + y < grid.length) && (i + x < grid[0].length) && !(i === 0 && j === 0)) {
        const wasRevealed = grid[j + y][i + x].status === ItemObjectStatus.Revealed;
        if (wasRevealed) continue;
        grid[j + y][i + x].status = ItemObjectStatus.Revealed;
        if (grid[j + y][i + x].nextBombsCount === 0) grid = handle0Bomb(grid, i + x, j + y);
      }
    }
  }
  return grid;
}

// Check if the game is over and if all boxes without bombs have been revealed
export function isOver(grid: GridObject) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (!grid[y][x].isBomb && grid[y][x].status !== ItemObjectStatus.Revealed) {
        return false;
      }
    }
  }
  return true;
}
