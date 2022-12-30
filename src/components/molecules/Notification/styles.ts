import styled from 'styled-components';

type TProps = {
  color?: string;
  chargerBar?: boolean;
};

export const Wrapper = styled.div<TProps>`
  box-sizing: border-box;
  width: 342px;
  height: ${(props) => props.chargerBar ? 92 : 75}px;
  display: flex;
  flex-direction: column;
  align-items: space-between;
  gap: 10px; ;
  border: 2px solid ${(props) => props.color || props.theme.NewPurpleColor};
  border-radius: 8px;
`;

export const Content = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const TextWrapper = styled.div`
  display: flex;
  gap: .6rem;
  align-items: flex-start;
  padding: 15px;
  padding-bottom: 5px;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding-top: 3px;
`;

export const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  font-family: 'MyriadPro';
  letter-spacing:  0.02em;
  color: ${(props) => props.theme.NewBlackColor};
`;

export const SubTitle = styled.p`
  font-size: .8rem;
  font-weight: 400;
  line-height: 1rem;
  font-family: 'MyriadPro';
  letter-spacing: 0.02em;
  color: ${(props) => props.theme.NewBlackColor};
`;

export const CloseIcon = styled.div<TProps>`
  cursor: pointer;
  border-radius: 50%;
  padding: 5px;
  color: ${(props) => props.color || props.theme.NewPurpleColor};
  font-size: 0.9rem;
  font-weight: 500;
  font-family: 'Epilogue';
  margin-left: auto;
  margin-bottom: auto;
`;