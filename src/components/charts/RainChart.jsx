import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RainChart = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">☔ Precipitación</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('es-MX')}
          />
          <YAxis label={{ value: 'mm', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleString('es-MX')}
            formatter={(value) => [`${value} mm`, "Lluvia"]}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#8884d8" 
            fill="#8884d8" 
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RainChart;