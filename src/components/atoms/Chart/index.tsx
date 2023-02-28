import {
  LineChart,
  Line,
} from 'recharts';



export const Chart = ({ chartData }) => (
  <LineChart width={100} height={30} data={chartData}>
    <Line type='monotone' dataKey='price' stroke='#715ff5' />
  </LineChart>
);
