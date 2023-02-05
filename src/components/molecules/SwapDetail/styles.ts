import styled from 'styled-components';

export const CollapsingContainerStyled = styled.div`
  background-color: white;
  box-sizing: border-box;
  justify-self: center;
  width: 100%;
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.NewGrayColor};
  border-radius: 20px;
  gap: 10px;
`;
export const CollapsingHeader = styled.section`
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
