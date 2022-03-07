import styled from 'styled-components'

export const SwapModalStyled = styled.div`
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    position: absolute;
    background-color:rgba(0, 0, 0,.3);
    display: grid;
    place-items: center;
    display:${prop => prop.isActive};
`

export const SwapContainerStyled = styled.section`
    width:30%;
    height:80%;
    background-color:white;
    color: black;
    display: flex;
    display:${prop => prop.isActive};
    flex-direction: column;
    border-radius:10px;
`
export const SwapHeaderLineStyled = styled.div`
    border-bottom: 1px solid black;
`

export const SwapHeaderStyled = styled.aside`
    display: flex;
    justify-content: space-between;
    padding:.8rem 2rem;

`
