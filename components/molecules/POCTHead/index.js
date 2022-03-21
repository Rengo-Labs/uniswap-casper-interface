import React from 'react'
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import { THeadStyled, TRowStyled, THeadersStyled } from './styles'
export const POCTHead = ({ headerGroups }) => {
    return (
        <THeadStyled>
            {headerGroups.map(headerGroup => (
                <TRowStyled {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
                        <THeadersStyled {...column.getHeaderProps(column.getSortByToggleProps())}>
                            {column.render('Header')}
                            {/* Add a sort direction indicator */}
                            <span>
                                {column.isSorted
                                    ? column.isSortedDesc
                                        ? <AiOutlineCaretDown />
                                        : <AiOutlineCaretUp />
                                    : ' '}
                            </span>
                        </THeadersStyled>
                    ))}
                </TRowStyled>
            ))}
        </THeadStyled>
    )
}
