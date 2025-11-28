import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconDefinition;
  color: string; // Class màu của Tailwind (VD: bg-blue-500)
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100 hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-full text-white mr-4 ${color} shadow-sm`}>
        <FontAwesomeIcon icon={icon} className="text-xl h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-1 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;