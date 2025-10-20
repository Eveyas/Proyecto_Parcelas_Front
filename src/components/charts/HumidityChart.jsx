import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HumidityChart = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">💧 Humedad</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('es-MX')}
          />
          <YAxis label={{ value: '%', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleString('es-MX')}
            formatter={(value) => [`${value} %`, "Humedad"]}
          />
          <Bar dataKey="valor" fill="#82ca9d" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HumidityChart;