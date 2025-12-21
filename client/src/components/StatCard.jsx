import React from 'react'

const StatCard = ({ label, value, subtext, icon: Icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow group cursor-default">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1 group-hover:text-gray-700 transition-colors">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-xs text-gray-400 mt-1">{subtext}</p>
      </div>

      <div className={`p-3 rounded-xl bg-${color}-500/10 group-hover:scale-110 transition-transform`}>
        <Icon size={24} className={`text-${color}-500`} />
      </div>
    </div>
  );
};


export default StatCard