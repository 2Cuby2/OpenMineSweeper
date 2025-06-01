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
  grid: GridObject;
  numBombs: number;
  gameStatus: GameStatus;
  pauseGame: () => void;
  restartGame: () => void;
  revealSquare: (x: number, y: number) => void;
  flagSquare: (x: number, y: number) => void;
};
export const GameManagerContext = createContext<GameManagerContextType>({
  grid: [],
  numBombs: 0,
  gameStatus: GameStatus.NotInitialized,
  pauseGame: () => { },
  restartGame: () => { },
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
  }, [setGameStatus]);

  const restartGame = useCallback(() => {
    const { grid: newGrid, numBombs: newNumBombs } = createBlankGrid(rows, cols);
    setGameStatus(GameStatus.Initialized);
    setNumBombs(newNumBombs);
    setGrid(newGrid);
  }, [setGameStatus, setNumBombs, setGrid]);

  const revealSquare = (x: number, y: number) => {
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
  };

  const flagSquare = (x: number, y: number) => {
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
  };

  return (
    <GameManagerContext.Provider
      value={{
        grid,
        numBombs,
        gameStatus,
        pauseGame,
        restartGame,
        revealSquare,
        flagSquare,
      }}
    >
      {children}
    </GameManagerContext.Provider>
  );
}
export default GameManagerProvider;
