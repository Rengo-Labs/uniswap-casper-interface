import styled, { keyframes } from 'styled-components';

type TProps = {
  time: number;
  color: string;
  height?: number;
  borderRadius?: any;
};

const progress = keyframes`
  100% {
    width: 339px;
  }
`;

export const ProgressBarFiller = styled.div<TProps>`
  height: ${props => props.height || 10}px;
  width: 0;
  background-color: ${props => props.color};
  animation: ${progress} ${props => props.time}s linear forwards;
  border-radius: ${props => props.borderRadius || 0};
  margin-top: auto;
  overflow: hidden;
`;

