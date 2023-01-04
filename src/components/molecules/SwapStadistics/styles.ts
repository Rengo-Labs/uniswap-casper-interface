import styled from 'styled-components';

export const Main = styled.main`
  box-sizing: border-box;
  justify-self: center;
  box-sizing: border-box;
  width: 100%;
  color: black;
  display: grid;
  grid-template-columns: auto auto;
  padding: 10px;
`

export const Wrapper = styled.section`
  justify-self: end;
  box-sizing: border-box;
  width: auto;
  border: 1px solid black;
  border-radius: 20px;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  gap: 10px;
  padding: 20px 25px;
  z-index: 2;

  & > *:not(:last-child){
    margin-bottom: 1rem;
  }
`
