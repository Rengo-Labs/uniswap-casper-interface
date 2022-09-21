import React from 'react'
import { AiOutlineCaretDown, AiOutlineCaretUp,AiOutlineGold } from "react-icons/ai";
import { THeadStyled, TRowStyled, THeadersStyled } from './styles'
import { v4 as uuidv4 } from 'uuid';

export const POCTHead2 = ({ headerGroups }) => {
    return (
        <THeadStyled>
            {headerGroups.map(headerGroup => (
                <TRowStyled {...headerGroup.getHeaderGroupProps()} key={uuidv4()}>
                    {headerGroup.headers.map(column => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
                        <THeadersStyled {...column.getHeaderProps(column.getSortByToggleProps())} key={uuidv4()}>
                            {column.render('Header')}
                            {/* Add a sort direction indicator */}
                            <span>
                                {column.isSorted
                                    ? column.isSortedDesc
                                        ? <AiOutlineCaretDown />
                                        : <AiOutlineCaretUp />
                                    : <AiOutlineGold />}
                            </span>
                        </THeadersStyled>
                    ))}
                </TRowStyled>
            ))}
        </THeadStyled>
    )
}
