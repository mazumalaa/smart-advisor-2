"use client"

import { LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBar, Bar } from 'recharts'

export function SimpleLineChart({ data, dataKey, seriesName }: { data: any[], dataKey: string, seriesName: string }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLine data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `Rp${(value/1000).toFixed(0)}k`} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            formatter={(value) => [
              typeof value === 'number' ? `Rp ${value.toLocaleString('id-ID')}` : String(value ?? ''),
              seriesName,
            ]}
          />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke="var(--color-primary)" 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
            activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
          />
        </RechartsLine>
      </ResponsiveContainer>
    </div>
  )
}

export function SimpleBarChart({ data, xKey, yKey, seriesName }: { data: any[], xKey: string, yKey: string, seriesName: string }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBar data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            formatter={(value) => [value ?? 0, seriesName]}
            cursor={{ fill: '#f8fafc' }}
          />
          <Bar dataKey={yKey} fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  )
}
