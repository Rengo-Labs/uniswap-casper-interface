import React from 'react'

export const NewIcons = ({ Icon, size, style = {} }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        width: size + 'px',
        height: size + 'px'
    }}>
        {/* TODO: remove inline css*/}
        <Icon width={size} height={size} style={style} />
    </div>
)