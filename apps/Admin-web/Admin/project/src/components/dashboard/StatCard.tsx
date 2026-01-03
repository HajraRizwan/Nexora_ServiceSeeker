import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
  trend: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, change, trend }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#19034d' }}>{value}</p>
          <div className="flex items-center space-x-1 mt-1">
            {trend === 'up' ? (
              <TrendingUp className="w-3 h-3 text-green-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-500" />
            )}
            <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </span>
            <span className="text-sm text-gray-500">vs last month</span>
            <span className="text-xs text-gray-500">vs last month</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#05f51d' }}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;