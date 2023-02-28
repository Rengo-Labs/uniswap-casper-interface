import {Line} from 'recharts/lib/cartesian/Line';
import {LineChart} from 'recharts/lib/chart/LineChart';

export const Chart = ({ chartData }) => (
  <LineChart width={100} height={30} data={chartData}>
    <Line type='monotone' dataKey='price' stroke='#715ff5' />
  </LineChart>
);
