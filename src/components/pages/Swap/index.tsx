import React from 'react'
import NewLayout from '../../../layout/NewLayout'
import { ContainerNSM } from '../../atoms/ContainerNSM'
import { ModuleSwapNSM } from '../../atoms/ModuleSwapNSM'
import SwapNewModule from '../../organisms/SwapModule'

export const Swap = () => {
  return (
    <NewLayout>
      <ContainerNSM>
        <ModuleSwapNSM>
          <SwapNewModule />
        </ModuleSwapNSM>
      </ContainerNSM>
    </NewLayout>
  )
}
