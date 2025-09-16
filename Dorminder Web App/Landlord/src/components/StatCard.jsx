import React, { useState } from 'react';

const StatCard = ({ title, value, subtitle, progress, progressText, color = 'blue', isDark = false, showHideMoney = false }) => {
  const [isMoneyVisible, setIsMoneyVisible] = useState(false);
  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return 'bg-green-500';
      case 'red':
        return 'bg-[#EE6C4D]';
      case 'blue':
        return 'bg-[#3D5A80]';
      case 'light-blue':
        return 'bg-[#98C1D9]';
      default:
        return 'bg-blue-500';
    }
  };

  const getTextClasses = () => {
    if (isDark) {
      return {
        title: 'text-white text-[25px] font-normal',
        value: 'text-white text-3xl font-bold',
        subtitle: 'text-white text-sm',
        progressText: 'text-white text-xs'
      };
    }
    return {
      title: 'text-gray-600 text-[25px] font-normal',
      value: 'text-gray-900 text-3xl font-bold',
      subtitle: 'text-gray-500 text-sm',
      progressText: 'text-gray-500 text-xs'
    };
  };

  const textClasses = getTextClasses();

  const toggleMoneyVisibility = () => {
    setIsMoneyVisible(!isMoneyVisible);
  };

  const displayValue = () => {
    if (showHideMoney && !isMoneyVisible) {
      return '******';
    }
    return value;
  };

  return (
    <div className={`${isDark ? 'bg-[#293241]' : 'bg-white'} rounded-lg shadow-sm p-6`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className={`${textClasses.title}`}>{title}</h3>
        {showHideMoney && (
          <button
            onClick={toggleMoneyVisibility}
            className={`p-1 rounded-md hover:bg-opacity-20 ${isDark ? 'hover:bg-white' : 'hover:bg-gray-100'}`}
          >
            <img 
              src={isMoneyVisible ? '/src/assets/icons/ic_hide.png' : '/src/assets/icons/ic_show.png'} 
              alt={isMoneyVisible ? 'Hide' : 'Show'} 
              className="w-5 h-5"
            />
          </button>
        )}
      </div>
      <div className={`${textClasses.value} mb-1`}>{displayValue()}</div>
      <p className={`${textClasses.subtitle} mb-4`}>{subtitle}</p>
      
      <div className="space-y-2">
        <div className={`w-full ${isDark ? 'bg-[#98C1D9]' : 'bg-gray-200'} rounded-full h-2`}>
          <div 
            className={`h-2 rounded-full ${getColorClasses(color)}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className={textClasses.progressText}>{progressText}</p>
      </div>
    </div>
  );
};

export default StatCard;
