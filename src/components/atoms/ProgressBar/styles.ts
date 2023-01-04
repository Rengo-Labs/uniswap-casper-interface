import styled from 'styled-components';

type TProps = {
  progress: number;
  color: string;
  height?: number;
  borderRadius?: any;
};

export const ProgressBarFiller = styled.div<TProps>`
  height: ${props => props.height || 10}px;
  width: ${props => props.progress}px;
  background-color: ${props => props.color};
  transition: width 0.2s ease-in;
  border-radius: ${props => props.borderRadius || 0};
  margin-top: auto;
  overflow: hidden;
`;