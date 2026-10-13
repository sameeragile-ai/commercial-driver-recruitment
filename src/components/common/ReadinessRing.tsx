import React from 'react';

interface ReadinessRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
}

export const ReadinessRing: React.FC<ReadinessRingProps> = ({
  percentage,
  size = 56,
  strokeWidth = 5,
  showLabel = true,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  // Color mapping based on compliance readiness
  let strokeColor = '#0E7C7B'; // Teal
  if (clampedPercentage < 50) {
    strokeColor = '#F5A524'; // Amber
  } else if (clampedPercentage < 80) {
    strokeColor = '#2563EB'; // Ocean blue
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#ECEAE4"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress stroke */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {showLabel && (
        <span
          className="absolute text-xs font-semibold font-mono tracking-tight text-[#14161A]"
          style={{ fontSize: size < 50 ? '10px' : '12px' }}
        >
          {clampedPercentage}%
        </span>
      )}
    </div>
  );
};
