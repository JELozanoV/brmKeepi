import React from 'react';
import { TrendSeries } from '../../types/operational';
import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis, YAxis } from 'recharts';

export interface TrendMiniChartProps {
  /** Serie temporal de un KPI */
  series: TrendSeries;
  height?: number;
}

const TrendMiniChart: React.FC<TrendMiniChartProps> = ({ series, height = 80 }) => {
  const data = series.points.map(p => ({ date: p.date.slice(5), value: p.value }));
  return (
    <div className="op-card" role="region" aria-label={`Histórico ${series.label}`}>
      <div className="card-title">Histórico (últimos {series.points.length} días)</div>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <XAxis dataKey="date" hide tick={{ fill: '#999' }} />
            <YAxis hide domain={['dataMin', 'dataMax']} />
            <Tooltip formatter={(v: any) => String(v)} labelStyle={{ color: '#ccc' }} contentStyle={{ background: '#111', border: '1px solid #1A4DFF' }} />
            <Line type="monotone" dataKey="value" stroke="#1A4DFF" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendMiniChart;


