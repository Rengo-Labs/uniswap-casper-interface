import styled from 'styled-components';

export const CasperIconContainer = styled.div.attrs(
    (props: { width?: number; height?: number }) => props
)`
  display: flex;
  alignitems: 'center';
  alignself: 'center';
  justifycontent: 'center';
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
`;
