'use client';

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

import { useState, useEffect } from 'react';

const data = [
  { name: 'Lun', users: 40, orders: 24, garages: 10 },
  { name: 'Mar', users: 30, orders: 13, garages: 12 },
  { name: 'Mer', users: 60, orders: 98, garages: 15 },
  { name: 'Jeu', users: 45, orders: 39, garages: 18 },
  { name: 'Ven', users: 90, orders: 48, garages: 22 },
  { name: 'Sam', users: 120, orders: 38, garages: 25 },
  { name: 'Dim', users: 150, orders: 43, garages: 30 },
];

const COLORS = ['#1565C0', '#F59E0B', '#6B7280'];

export default function AnalyticsCharts() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[400px]" />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Platform Growth Chart */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900">Croissance de la Plateforme</h2>
          <select className="text-xs font-bold text-gray-400 bg-gray-50 border-none rounded-lg px-2 py-1 outline-none">
            <option>7 derniers jours</option>
            <option>30 derniers jours</option>
          </select>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1565C0" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#1565C0" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#9CA3AF'}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#9CA3AF'}} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#1565C0" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorUsers)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Comparison */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900">Commandes vs Garages</h2>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{background:'#1565C0'}}></div>
                <span className="text-[10px] font-bold text-gray-500">Commandes</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{background:'#F59E0B'}}></div>
                <span className="text-[10px] font-bold text-gray-500">Garages</span>
             </div>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#9CA3AF'}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#9CA3AF'}} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="orders" fill="#1565C0" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="garages" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
