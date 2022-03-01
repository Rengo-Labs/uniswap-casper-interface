import React from 'react'
import { Title, ImgRender } from '../../atoms'
import { BrandStyles } from './styles'
import { useRouter } from 'next/router'
export const Brand = ({ title, url }) => {
    const router = useRouter()
    const handleClick = (e) => {
        e.preventDefault()
        router.push('/')
    }
    return (
        <BrandStyles onClick={handleClick}>
            <ImgRender url={url} />
            <Title title={title} />
        </BrandStyles>
    )
}
