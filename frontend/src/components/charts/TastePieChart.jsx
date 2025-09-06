// components/charts/TastePieChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

const TastePieChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-purple-500/30 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-gray-300">
            <span className="text-pink-400">{data.value}%</span> of your taste
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (value < 8) return null; // Don't show labels for small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${name} ${value}%`}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }} className="text-sm">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Genre Breakdown */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {data.map((genre) => (
          <motion.div
            key={genre.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * data.indexOf(genre) }}
            className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg"
          >
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: genre.color }}
            />
            <div>
              <p className="text-white text-sm font-medium">{genre.name}</p>
              <p className="text-gray-400 text-xs">{genre.value}%</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TastePieChart;