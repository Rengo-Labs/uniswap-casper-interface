import React from 'react'

export function NewIcons({ icon, size, style={} }) {
    return (
        <div style={{display: 'block', width: size + 'px', height: size + 'px'}}>
            <img style={style} src={icon} width={size} height={size} />
        </div>
    )
}
