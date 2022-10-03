import React from 'react'
import { TiArrowUnsorted, TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";
import { THeadStyled, THeader6Styled, THeader3Styled, THeaderStyled, THeaderTitle } from './styles'
import { v4 as uuidv4 } from 'uuid';
import {RiCheckboxBlankCircleLine} from "react-icons/ri";


const Header = ({headerGroup, header } : any) => {
    return <THeader3Styled {...headerGroup.getHeaderGroupProps()} {...header.getHeaderProps(header.getSortByToggleProps())} key={uuidv4()}>
        <THeaderTitle>
            {header.Header}
        </THeaderTitle>
        <div>
            {header.isSorted ? header.isSortedDesc
                    ? <TiArrowSortedDown /> : <TiArrowSortedUp />
                : <TiArrowUnsorted />
            }
        </div>
    </THeader3Styled>
}

export const POCTHead = ({ headerGroups }) => {
    return (
        <THeadStyled>
            {
                <THeader6Styled {...headerGroups[0].getHeaderGroupProps()} {...headerGroups[0].headers[0].getHeaderProps(headerGroups[0].headers[0].getSortByToggleProps())} key={uuidv4()}>
                    <THeaderTitle>
                        {headerGroups[0].headers[0].Header}
                    </THeaderTitle>
                    <div>
                        {headerGroups[0].headers[0].isSorted
                            ? headerGroups[0].headers[0].isSortedDesc
                                ? <TiArrowSortedDown />
                                : <TiArrowSortedUp />
                            : <TiArrowUnsorted />}
                    </div>
                </THeader6Styled>
            }
            <Header headerGroup={headerGroups[0]} header={headerGroups[0].headers[1]} />
            <Header headerGroup={headerGroups[0]} header={headerGroups[0].headers[2]} />
            <Header headerGroup={headerGroups[0]} header={headerGroups[0].headers[3]} />
            <Header headerGroup={headerGroups[0]} header={headerGroups[0].headers[4]} />
            <THeaderStyled>
                <div><RiCheckboxBlankCircleLine /></div>
            </THeaderStyled>
        </THeadStyled>
    )
}
