import React from 'react'
import { Title, ImgRender } from '../../atoms'
import { BrandStyles } from './styles'

export const Brand = ({ title, url }) => {
    return (
        <BrandStyles>
            <ImgRender url={url} />
            <Title title={title} />
        </BrandStyles>
    )
}
