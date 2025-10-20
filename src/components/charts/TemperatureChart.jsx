import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TemperatureChart = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">🌡️ Temperatura</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('es-MX')}
          />
          <YAxis label={{ value: '°C', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleString('es-MX')}
            formatter={(value) => [`${value} °C`, "Temperatura"]}
          />
          <Line 
            type="monotone" 
            dataKey="valor" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;