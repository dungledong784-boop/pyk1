import React from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsChartProps {
  data: { time: string; value: number }[];
  active: boolean;
}

const StatsChart: React.FC<StatsChartProps> = React.memo(({ data, active }) => {
  return (
    <div className="h-32 w-full mt-4 transition-opacity duration-500" style={{ opacity: active ? 1 : 0.5 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#10b981' }}
            cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#10b981" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

export default StatsChart;