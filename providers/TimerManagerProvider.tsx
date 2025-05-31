/* eslint @typescript-eslint/no-empty-function: "off" */

import React, {
  createContext,
  useState,
  useCallback,
} from 'react';

export enum TimerStatus {
  Idle = 0,
  Running = 1,
}

type TimerManagerContextType = {
  timerStatus: TimerStatus;
  start: () => void;
  reset: () => void;
};
export const TimerManagerContext = createContext<TimerManagerContextType>({
  timerStatus: TimerStatus.Idle,
  start: () => { },
  reset: () => { },
});

type TimerManagerProviderProps = { children: React.JSX.Element | React.JSX.Element[] };
function TimerManagerProvider({ children }: TimerManagerProviderProps) {
  const [timerStatus, setTimerStatus] = useState(TimerStatus.Idle);

  const start = useCallback(() => setTimerStatus(TimerStatus.Running), []);

  const reset = useCallback(() => setTimerStatus(TimerStatus.Idle), []);

  return (
    <TimerManagerContext.Provider value={{ timerStatus, start, reset }}>
      {children}
    </TimerManagerContext.Provider>
  );
}

export default TimerManagerProvider;
