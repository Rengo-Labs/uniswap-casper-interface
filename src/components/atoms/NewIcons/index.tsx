import React from 'react'

export function NewIcons({ icon, size, style={} }) {
    return (
        <img style={style} src={icon} width={size} height={size} />
    )
}
