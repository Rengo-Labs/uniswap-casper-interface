import React from 'react'

export const POCTHead = ({ headerGroups }) => {
    return (
        <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                            {column.render('Header')}
                            {/* Add a sort direction indicator */}
                            <span>
                                {column.isSorted
                                    ? column.isSortedDesc
                                        ? ' 🔽'
                                        : ' 🔼'
                                    : ''}
                            </span>
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
    )
}
