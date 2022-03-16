import styled from 'styled-components'

export const SwapModalStyled = styled.div`
    width: 100vw;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    background-color:${prop => prop.theme.StrongColor4};
    display: grid;
    place-items: center;
    display:${prop => prop.isActive};
    
`

export const SwapContainerStyled = styled.section`
    box-sizing: border-box;
    padding: .5rem;
    width:30%;
    height:80%;
    background-color:${prop => prop.theme.StrongColor2};
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    color: white;
    display: flex;
    gap:1rem;
    display:${prop => prop.isActive};
    flex-direction: column;
    border-radius:10px;
`

export const SwapHeaderStyled = styled.aside`
    display: flex;
    justify-content: space-between;
    font-size: 1.5rem;
`
export const CloseButtonStyled = styled.button`
    background-color: transparent;
    color: ${prop => prop.theme.TertiaryColor};
    border-style: none;
    font-size: 1.5rem;
    cursor: pointer;
`
