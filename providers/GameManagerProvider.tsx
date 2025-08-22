/* eslint @typescript-eslint/no-empty-function: "off" */

import React, {
  createContext,
  useState,
  useCallback,
} from 'react';

import {
  createBlankGrid,
  setupGrid,
  handle0Bomb,
  isOver,
  GridObject,
  ItemObject,
  ItemObjectStatus,
} from '@/providers/utils';

export enum GameStatus {
  NotInitialized = 0,
  Initialized = 1,
  Paused = 2,
  Started = 3,
  Lost = 4,
  Won = 5,
}

type GameManagerContextType = {
  numBombs: number;
  gameStatus: GameStatus;
  pauseGame: () => void;
  restartGame: () => void;
  getSquare: (x: number, y: number) => ItemObject | undefined;
  getSurroundingSquares: (x: number, y: number) => {
    left?: ItemObject;
    right?: ItemObject;
    top?: ItemObject;
    bottom?: ItemObject;
  };
  revealSquare: (x: number, y: number) => void;
  flagSquare: (x: number, y: number) => void;
};
export const GameManagerContext = createContext<GameManagerContextType>({
  numBombs: 0,
  gameStatus: GameStatus.NotInitialized,
  pauseGame: () => { },
  restartGame: () => { },
  getSquare: () => undefined,
  getSurroundingSquares: () => ({}),
  revealSquare: () => ({
    isBomb: false,
    nextBombsCount: 0,
    status: ItemObjectStatus.Hidden
  }),
  flagSquare: () => ({
    isBomb: false,
    nextBombsCount: 0,
    status: ItemObjectStatus.Hidden
  }),
});

type GameManagerProviderProps = {
  rows: number;
  cols: number;
  children: React.JSX.Element | React.JSX.Element[];
};
function GameManagerProvider({ rows, cols, children }: GameManagerProviderProps) {
  // Number of bombs
  const [numBombs, setNumBombs] = useState<number>(0);
  // Grid
  const [grid, setGrid] = useState<GridObject>([]);
  // Game status
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NotInitialized);

  const pauseGame = useCallback(() => {
    setGameStatus(GameStatus.Paused);
  }, []);

  const restartGame = useCallback(() => {
    const { grid: newGrid, numBombs: newNumBombs } = createBlankGrid(rows, cols);
    setGameStatus(GameStatus.Initialized);
    setNumBombs(newNumBombs);
    setGrid(newGrid);
  }, [cols, rows]);

  const getSquare = useCallback((x: number, y: number) => {
    if (0 <= y && y < grid.length && 0 <= x && x < grid[0].length) {
      return grid[y][x];
    }
    return undefined;
  }, [grid]);

  const getSurroundingSquares = useCallback((x: number, y: number) => ({
    top: getSquare(x, y - 1),
    bottom: getSquare(x, y + 1),
    left: getSquare(x - 1, y),
    right: getSquare(x + 1, y),
  }), [getSquare])

  const revealSquare = useCallback((x: number, y: number) => {
    // If it's the first move, set the grid
    if (gameStatus === GameStatus.Initialized) {
      setupGrid(grid, numBombs, x, y);
      setGameStatus(GameStatus.Started);
    }

    grid[y][x].status = ItemObjectStatus.Revealed;

    // If it's a bomb, game is lost
    if (grid[y][x].isBomb) {
      setGameStatus(GameStatus.Lost);
    } else {
      // If 0 bomb, recursivly reveal the other squares
      if (grid[y][x].nextBombsCount === 0) {
        handle0Bomb(grid, x, y);
      }

      setGrid([...grid]);

      // Check if game is over and display the winning message
      if (isOver(grid)) {
        setGameStatus(GameStatus.Won);
      }
    }
  }, [grid, gameStatus, numBombs]);

  const flagSquare = useCallback((x: number, y: number) => {
    switch (grid[y][x].status) {
      case ItemObjectStatus.Flagged:
        grid[y][x].status = ItemObjectStatus.Hidden;
        break;
      case ItemObjectStatus.Hidden:
        grid[y][x].status = ItemObjectStatus.Flagged;
        break;
      default:
        break;
    }

    setGrid([...grid]);
  }, [grid]);

  return (
    <GameManagerContext.Provider
      value={{
        numBombs,
        gameStatus,
        pauseGame,
        restartGame,
        getSquare,
        getSurroundingSquares,
        revealSquare,
        flagSquare,
      }}
    >
      {children}
    </GameManagerContext.Provider>
  );
}
export default GameManagerProvider;
