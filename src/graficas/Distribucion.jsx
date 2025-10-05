import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/graficas.css';

const Distribucion = ({ data }) => {
  const COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];

  return (
    <div className="grafica-container">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ cultivo, percent }) => `${cultivo}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="area"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Área']}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e0e0e0',
              borderRadius: '8px'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Distribucion;