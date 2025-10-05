import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles/graficas.css';

const Humedad = ({ data }) => {
  return (
    <div className="grafica-container">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="dia" 
            stroke="#666"
            fontSize={12}
          />
          <YAxis 
            label={{ value: '%', angle: -90, position: 'insideLeft' }}
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
          <Bar 
            dataKey="valor" 
            fill="#4ecdc4" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Humedad;