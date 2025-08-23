import { useContext } from 'react';

import { GameManagerContext } from '@/providers/GameManagerProvider';
export { GameStatus } from '@/providers/GameManagerProvider';

export default function useGameManager() {
  return useContext(GameManagerContext);
}
