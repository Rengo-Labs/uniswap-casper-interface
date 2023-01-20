import React, {createContext, ReactNode, useContext, useEffect, useReducer, useState} from 'react'

import {Timer} from "../../components/atoms/UpdatableCircle/timer"

export interface ProgressBarContext {
  progressBar: (callback: any, seconds?: number) => any,
  clearProgress: () => void,
  setProgress: (v: number) => void,
  getProgress: number,
  stopProgress: () => void
}

export const ProgressBarProviderContext = createContext<ProgressBarContext>({} as any)

export const ProgressBarContextWithReducer = ({ children }: { children: ReactNode }) => {

  const [progress, setProgress] = useState(1)
  const [progressTimer, setProgressTimer] = useState<any>()
  const [interval, setInt] = useState<any>()
  const timer = new Timer()

  const progressBarExec = (handle, sec= 30) => {
    if (progressTimer) {
      clearInterval(interval)
      progressTimer.stop()
    }

    if (timer.isRunning) return;

    timer.start();

    const inter = setInterval(() => {
      const timeInSeconds = Math.min((timer.getTime() / 1000) * (100/sec), 100);
      if (timeInSeconds >= 99) {

        new Promise(handle).then()
        timer.reset()
        setProgress(1)
      } else {
        setProgress(timeInSeconds)
      }
    }, 500)

    setInt(inter)
    setProgressTimer(timer)
  }

  const clearProgressBar = () => {
    progressTimer.reset()
  }

  const stopProgressBar = () => {
    progressTimer?.stop()
  }

  return (
    <ProgressBarProviderContext.Provider value={{
      progressBar: progressBarExec,
      clearProgress: clearProgressBar,
      setProgress: setProgress,
      getProgress: progress,
      stopProgress: stopProgressBar
    }}>
      {children}
    </ProgressBarProviderContext.Provider>
  )
}