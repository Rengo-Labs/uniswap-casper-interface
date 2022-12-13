import React, {createContext, ReactNode, useEffect, useReducer, useState} from 'react'

import {Timer} from "../../components/atoms/UpdatableCircle/timer";

export interface ProgressBarContext {
  progressBar: (seconds: number, callback: any) => any,
  clearProgress: () => void,
  setProgress: (v: number) => void,
  getProgress: number,
  refresh: () => void
}

export const ProgressBarProviderContext = createContext<ProgressBarContext>({} as any)

export const ProgressBarReducer = ({ children }: { children: ReactNode }) => {

  const [progress, setProgress] = useState(1)
  const [progressTimer, setProgressTimer] = useState<any>()
  const [internalCallback, setInternalCallback] = useState<any>(null)

  const timer = new Timer()

  useEffect(() => {
    //I must probably use an action list to manage different re loaders (for pool page, swap page, liq page)
    progressBarExec(30, async () => { console.log("Hola mundo")})
  }, [! timer.getState()])

  const progressBarExec = (sec, handle) => {

    if (timer.isRunning) return;

    timer.start();

    setInterval(() => {
      const timeInSeconds = Math.min((timer.getTime() / 1000) * (100/sec), 100);
      if (timeInSeconds >= 99) {

        //TODO I need to execute this handle after getting 100
        new Promise(handle).then()
        //handle().then()
        timer.reset()
        setProgress(1)
      } else {
        setProgress(timeInSeconds)
      }
    }, 2000)

    setProgressTimer(timer)
    //setInternalCallback(handle)
  }

  const clearProgressBar = () => {
    if (progressTimer) progressTimer.reset()
  }

  const refresh = async () => {
    //await internalCallback()
  }

  return (
    <ProgressBarProviderContext.Provider value={{
      progressBar: progressBarExec,
      clearProgress: clearProgressBar,
      setProgress: setProgress,
      getProgress: progress,
      refresh
    }}>
      {children}
    </ProgressBarProviderContext.Provider>
  )
}