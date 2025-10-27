'use client';

interface StatsCardProps {
  label: string;
  value: number;
  color?: string;
}

export default function StatsCards({ stats }: { stats: StatsCardProps[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4">
          <div className="text-gray-600 text-sm">{stat.label}</div>
          <div className={`text-3xl font-bold ${stat.color || 'text-green-600'}`}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}
