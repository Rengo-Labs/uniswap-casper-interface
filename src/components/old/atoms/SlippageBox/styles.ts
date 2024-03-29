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
  font-family: 'MyriadPro';
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
  font-family: 'MyriadPro';
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
  border: solid 0.5px ${(props) => props.theme.NewPurpleColor};
  padding: 3px;
  border-radius: 2px;
`;
export const Span = styled.span`
  position: absolute;
  right: 0.5vw;
  top: 3px;
`;
