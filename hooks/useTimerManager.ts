import { useContext } from 'react';

import { TimerManagerContext } from '@/providers/TimerManagerProvider';

export default function useTimerManager() {
    return useContext(TimerManagerContext);
}
