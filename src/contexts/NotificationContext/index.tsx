import React, { createContext, ReactNode, useState } from 'react'
import { NotificationQueue } from '../../components/atoms'
import { v4 as uuidv4 } from 'uuid';
export const NotificationProviderContext = createContext<any>({})

export function NotificationContext({ children }: { children: ReactNode }) {
  const second = 1000 * 2

  const [notifications, notificationsSetter] = useState([1])

  function showNotification() {
    setTimeout(() => { }, second)
  }

  function forceCloseNotification() { }

  function addNotification(newNotification) {
    notificationsSetter([...notifications, newNotification])
  }

  return (
    <NotificationProviderContext.Provider value={{ notifications, notificationsSetter }} >
      <>
        {notifications.length > 0 && notifications.map((x) => {
          return (
            <NotificationQueue key={uuidv4()} />
          )
        })}
        {children}
      </>
    </NotificationProviderContext.Provider>
  )
}
