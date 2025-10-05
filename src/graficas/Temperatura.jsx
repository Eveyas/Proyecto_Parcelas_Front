import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles/graficas.css';

const Temperatura = ({ data }) => {
  return (
    <div className="grafica-container">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="hora" 
            stroke="#666"
            fontSize={12}
          />
          <YAxis 
            label={{ value: '°C', angle: -90, position: 'insideLeft' }}
            stroke="#666"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e0e0e0',
              borderRadius: '8px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="valor" 
            stroke="#ff6b6b" 
            strokeWidth={3}
            dot={{ fill: '#ff6b6b', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#ff5252' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Temperatura;
