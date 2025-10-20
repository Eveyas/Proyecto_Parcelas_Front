import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SolarRadiationChart = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">☀️ Radiación Solar</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('es-MX')}
          />
          <YAxis label={{ value: 'W/m²', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleString('es-MX')}
            formatter={(value) => [`${value} W/m²`, "Radiación"]}
          />
          <Scatter dataKey="valor" fill="#ffc658" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SolarRadiationChart;