import { LineChart, Line } from 'recharts';

export const Chart = ({ tokenOldPrice, tokenCurrentPrice }) => {

  const data = [
    { name: '24H', uv: tokenOldPrice},
    { name: 'Now', uv: tokenCurrentPrice},
  ];
  return (
    <LineChart width={100} height={20} data={data}>
      <Line type='monotone' dataKey='uv' stroke='#715ff5' />
    </LineChart>
  );
};
