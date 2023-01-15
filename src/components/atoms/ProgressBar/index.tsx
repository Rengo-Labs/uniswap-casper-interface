import { ProgressBarFiller } from './styles';

interface IProgressBar {
  time: number;
  height?: number;
  color: string;
  borderRadius?: any;
}

export const ProgressBar = ({
  time,
  height,
  color,
  borderRadius,
}: IProgressBar) => {
  return (
    <ProgressBarFiller
      time={time}
      height={height}
      color={color}
      borderRadius={borderRadius}
    />
  );
};
