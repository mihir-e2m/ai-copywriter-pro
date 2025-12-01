import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  gradient?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, gradient = 'from-orange-500 to-orange-600' }) => {
  return (
    <div className="group relative bg-gradient-to-br from-white to-orange-50/20 dark:from-slate-900/90 dark:to-slate-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-orange-200/40 dark:border-orange-500/20 hover:border-orange-400 dark:hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative flex items-center gap-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg group-hover:shadow-orange-500/40 group-hover:scale-105 transition-all duration-300`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        </div>
      </div>
    </div>
  );
};
