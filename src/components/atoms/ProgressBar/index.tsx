import { ProgressBarFiller } from './styles';

interface IProgressBar {
  progress: number;
  height?: number;
  color: string;
  borderRadius?: any;
}

export const ProgressBar = ({
  progress,
  height,
  color,
  borderRadius,
}: IProgressBar) => {
  return (
    <ProgressBarFiller
      progress={progress}
      height={height}
      color={color}
      borderRadius={borderRadius}
    />
  );
};
