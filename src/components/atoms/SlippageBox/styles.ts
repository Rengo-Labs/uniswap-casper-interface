import styled from 'styled-components';

export const SlippageContainer = styled.section`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
`;
export const SlippageColumnLeft = styled.section`
  width: 50%;
  text-align: start;
  font-family: 'Myriad Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.02em;
  color: #545454;
`;
export const SlippageColumnRight = styled.section`
  width: 50%;
  text-align: end;
  font-family: 'Myriad Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.02em;
  color: #545454;
`;
export const Input = styled.input`
  background: transparent;
  color: black;
  width: 30%;
  border: solid 0.5px black;
`;
export const Span = styled.span`
  position: absolute;
  right: 0.5vw;
  top: 3px;
`;
