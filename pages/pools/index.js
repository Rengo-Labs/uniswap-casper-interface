import React from 'react'
import { useRouter } from 'next/router'

import { NavegableTemplate } from '../../components/templates/NavegableTemplate'
import { CardContainer } from '../../components/atoms'
import { SwapModule } from '../../components/molecules'

import { usUS } from '../../components/i11n'
const Swap = () => {
  const router = useRouter()
  const handleClick = (e) => {
    e.preventDefault()
    router.push('/swap')
  }

  const { brandName, brandIMG, mainButton, listOfLinks } = usUS

  return (
    <NavegableTemplate title={brandName} url={brandIMG} content={mainButton} handler={handleClick} listOfLinks={listOfLinks}>
      <CardContainer cardTitle="Top Pools" width="68%">
        <table>
          [W.I.P.]
          <tr>
            <th>Name</th>
            <th>Liquidity</th>
            <th>Volume (24hr)</th>
            <th>Volume (7D)</th>
            <th>Fees (24hr)</th>
            <th>1y Fees / Liquidity</th>
          </tr>
          {[1, 2, 3, 4, 5, 6,8,8,8,8,8,8,8,8].map(x => {
            return (
              <tr>
                <td>ABC-DFG</td>
                <td>$78,438,726.23</td>
                <td>$11,438,726.23</td>
                <td>$68,438,726.23</td>
                <td>$28,726.23</td>
                <td>13.19%</td>
              </tr>
            )
          })}
        </table>
      </CardContainer >
    </NavegableTemplate>
  )
}

export default Swap
