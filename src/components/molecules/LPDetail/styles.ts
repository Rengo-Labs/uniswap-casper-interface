import styled from 'styled-components';

export const CollapsingContainerStyled = styled.div`
  background-color: white;
  width: 90%;
  padding: 5%;
  border-radius: 10px;
  border: 1px solid black;
  grid-template-rows: auto auto;
`;
export const CollapsingHeader = styled.section`
    padding: 0;
    color: ${(props) => props.theme.secondBackgroundColor};
    cursor: pointer;
`;
export const CollapsingBody = styled.div`
  padding: 6px;
`;
export const CollapsingRow = styled.div`
  display: flex;
  padding-top: 12px;
  font-size: 14px;
`;
export const CollapsingColumnLeft = styled.div`
  flex: 1;
  text-align: left;
  font-family: 'MyriadPro';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.02em;
  color: #545454;
`;
export const CollapsingColumnRight = styled.div`
  flex: 1;
  text-align: right;
  font-family: 'MyriadPro';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.02em;
  color: #545454;
`;
