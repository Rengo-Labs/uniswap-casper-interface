import { time } from 'console';
import { useEffect, useState, useRef } from 'react';
import { ReactComponent as Info } from '../../../assets/newIcons/info.svg';
import { ReactComponent as Check } from '../../../assets/newIcons/check-circle.svg';
import { ReactComponent as Alert } from '../../../assets/newIcons/alert-circle.svg';
import { ReactComponent as Close } from '../../../assets/newIcons/x.svg';
import { NotificationType } from '../../../constant';
import { NewIcons, ProgressBar } from '../../atoms';
import {
  CloseIcon,
  Content,
  SubTitle,
  TextWrapper,
  Title,
  TitleWrapper,
  Wrapper,
} from './styles';

const notificationType = {
  [NotificationType.Success]: {
    color: '#1DC90A',
    icon: Check,
  },
  [NotificationType.Error]: {
    color: '#E83C3C',
    icon: Alert,
  },
  [NotificationType.Info]: {
    color: 'rgba(113, 95, 245, 1)',
    icon: Info,
  },
};

export interface INotification {
  title: string;
  subtitle?: string;
  type: string;
  onClose?: () => void;
  chargerBar?: boolean;
  timeToClose?: number;
}

export const Notification = ({
  title,
  subtitle,
  type,
  onClose,
  chargerBar = false,
  timeToClose = 20,
}: INotification) => {
  const [value, setValue] = useState(1);
  const timeRef = useRef(1);

  useEffect(() => {
    if (chargerBar) {
      const interval = setInterval(() => {
        if (timeRef.current === timeToClose) {
          onClose();
        }
        const value = (timeRef.current * 342) / timeToClose;
        setValue(value);
        timeRef.current += 1;
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <Wrapper color={notificationType[type].color} chargerBar={chargerBar}>
      <Content>
        <TextWrapper>
          <NewIcons
            Icon={notificationType[type].icon}
            size={24}
            style={{ fill: notificationType[type].color }}
          />
          <TitleWrapper>
            <Title>{title}</Title>
            {subtitle && <SubTitle>{subtitle}</SubTitle>}
          </TitleWrapper>
        </TextWrapper>
        <CloseIcon onClick={onClose} color={notificationType[type].color}>
          <NewIcons
            Icon={Close}
            size={16}
            style={{ fill: notificationType[type].color }}
          />
        </CloseIcon>
      </Content>
      {chargerBar && timeRef.current > 1 && (
        <ProgressBar
          color={notificationType[type].color}
          progress={value}
          borderRadius='0 0 0 .5rem'
        />
      )}
    </Wrapper>
  );
};
