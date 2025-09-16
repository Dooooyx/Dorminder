import React from 'react';
import StatCard from './StatCard';

const StatsGrid = () => {
  const stats = [
    {
      title: "Rent Collected",
      value: "P120,000",
      subtitle: "This Month",
      progress: 100, // 100% as shown in the image
      progressText: "100% of P150,000 expected",
      color: "green",
      isDark: true,
      showHideMoney: true
    },
    {
      title: "Total Rooms",
      value: "120",
      subtitle: "15 Vacant",
      progress: 87.5, // 105 / 120 * 100
      progressText: "105/120 Occupied",
      color: "light-blue",
      isDark: false
    },
    {
      title: "Active Tenants",
      value: "98",
      subtitle: "Currently Occupied",
      progress: 81.7, // 98 / 120 * 100
      progressText: "98/120 capacity",
      color: "blue",
      isDark: false
    },
    {
      title: "Pending Request",
      value: "7",
      subtitle: "Open Requests",
      progress: 28, // 7 / 25 * 100
      progressText: "7/25 total this month",
      color: "red",
      isDark: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          progress={stat.progress}
          progressText={stat.progressText}
          color={stat.color}
          isDark={stat.isDark}
          showHideMoney={stat.showHideMoney}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
