import NewLayout from '../../../layout/NewLayout'
import SwapNewModule from '../../organisms/SwapNewModule'
import { ContainerSwapModule } from '../../atoms/ContainerSwapModule'

export const Swap = () => {
  return (
    <NewLayout>
      <ContainerSwapModule>
        <div>
          <SwapNewModule />
        </div>
      </ContainerSwapModule>
    </NewLayout>
  )
}
