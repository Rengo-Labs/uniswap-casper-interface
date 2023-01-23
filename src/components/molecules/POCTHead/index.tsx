import React, {useContext, useEffect} from 'react'

import {FiChevronDown, FiChevronUp} from "react-icons/fi";
import { THeadStyled, THeader6Styled, THeader3Styled, THeaderStyled, THeaderTitle, THeadArrowStyled } from './styles'
import { v4 as uuidv4 } from 'uuid';
import {UpdatableCircle} from "../../atoms/UpdatableCircle";
import {ConfigProviderContext} from "../../../contexts/ConfigContext";
import {ProgressBarProviderContext} from "../../../contexts/ProgressBarContext";
import {BsChevronExpand} from "react-icons/bs";

export const Header = ({headerGroup, header } : any) => {
    return <THeader3Styled {...headerGroup.getHeaderGroupProps()} {...header.getHeaderProps(header.getSortByToggleProps())} key={uuidv4()}>
        <THeaderTitle>
            {header.Header}
        </THeaderTitle>
        <THeadArrowStyled>
            {header.isSorted ? header.isSortedDesc
                    ? <FiChevronDown /> : <FiChevronUp />
                : <BsChevronExpand />
            }
        </THeadArrowStyled>
    </THeader3Styled>
}

const HeaderIcon = () => {
  const {refreshAll} = useContext(ConfigProviderContext)
  const {progressBar} = useContext(ProgressBarProviderContext)

  useEffect(() => {
    progressBar(async () => {
      await refreshAll()
    }, 180)
  }, [])

  const refreshPrices = async () => {
    await refreshAll()
  }

  return <THeaderStyled>
    <div><UpdatableCircle strokeWidth={12} handler={refreshPrices} /></div>
  </THeaderStyled>
}

export const POCTHead = ({ headerGroups }) => {

    return (
        <THeadStyled>
            {
                <THeader6Styled {...headerGroups[0].getHeaderGroupProps()} {...headerGroups[0].headers[0].getHeaderProps(headerGroups[0].headers[0].getSortByToggleProps())} key={uuidv4()}>
                    <THeaderTitle>
                        {headerGroups[0].headers[0].Header}
                    </THeaderTitle>
                    <THeadArrowStyled>
                        {headerGroups[0].headers[0].isSorted
                            ? headerGroups[0].headers[0].isSortedDesc
                                ? <FiChevronDown />
                                : <FiChevronUp />
                            : <BsChevronExpand />}

                    </THeadArrowStyled>
                </THeader6Styled>
            }
            <Header headerGroup={headerGroups[0]} header={headerGroups[0].headers[1]} />
            <Header headerGroup={headerGroups[0]} header={headerGroups[0].headers[2]} />
            <Header headerGroup={headerGroups[0]} header={headerGroups[0].headers[3]} />
            <Header headerGroup={headerGroups[0]} header={headerGroups[0].headers[4]} />
            <HeaderIcon />
        </THeadStyled>
    )
}
