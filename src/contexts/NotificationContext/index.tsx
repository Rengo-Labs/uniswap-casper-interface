import React, { createContext, ReactNode, useState } from 'react'

export const NotificationProviderContext = createContext<any>({})

export function NotificationContext({ children }: { children: ReactNode }) {
  const second = 1000 * 2

  const [notification,notificationSetter] = useState<Array<any>>()

  function showNotification(){
    setTimeout(()=>{},second)
  }

  function forceCloseNotification(){}

  function addNotification(newNotification){
    notificationSetter([...notification,newNotification])
  }

  return (
    <NotificationProviderContext.Provider value={{notification,notificationSetter}} >
      {children}
    </NotificationProviderContext.Provider>
  )
}
