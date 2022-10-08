import React from 'react'

export const NewIcons = ({ Icon, size, style={} }) => (
    <div style={{
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        width: size + 'px', 
        height: size + 'px'
    }}>
        <Icon width={size} height={size}/>
    </div>
)