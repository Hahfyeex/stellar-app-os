import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { cn } from '../ui/utils';

interface RiskGaugeProps {
  healthScore: number; // 0-100
  collateralRatio: number;
  className?: string;
}

export function RiskGauge({ healthScore, collateralRatio, className }: RiskGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate from 0 to healthScore on mount
    const timer = setTimeout(() => {
      setAnimatedScore(healthScore);
    }, 100);
    return () => clearTimeout(timer);
  }, [healthScore]);

  // Determine risk level and color
  const getRiskLevel = (score: number) => {
    if (score <= 30) return { level: 'High Risk', color: 'red' };
    if (score <= 70) return { level: 'Moderate Risk', color: 'yellow' };
    return { level: 'Low Risk', color: 'green' };
  };

  const risk = getRiskLevel(healthScore);
  const isHighRisk = collateralRatio < 120;

  // Convert score to angle (180 degrees semicircle)
  // 0 score = -90deg, 100 score = 90deg
  const angle = (animatedScore / 100) * 180 - 90;

  // Get color based on score
  const getGaugeColor = (score: number) => {
    if (score <= 30) return '#ef4444'; // red-500
    if (score <= 70) return '#eab308'; // yellow-500
    return '#22c55e'; // green-500
  };

  const needleColor = getGaugeColor(healthScore);

  return (
    <div className={cn('relative', className)}>
      {/* High Risk Pulsating Glow */}
      {isHighRisk && (
        <motion.div
          className="absolute inset-0 rounded-full bg-red-500/20 blur-2xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      <div className="relative bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
        {/* Gauge Container */}
        <div className="relative w-full aspect-[2/1] max-w-md mx-auto">
          {/* Background Arc */}
          <svg
            viewBox="0 0 200 110"
            className="w-full h-full"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="30%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="70%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>

              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background track */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="20"
              strokeLinecap="round"
            />

            {/* Colored gauge arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="20"
              strokeLinecap="round"
            />

            {/* Tick marks */}
            {[0, 30, 70, 100].map((value) => {
              const tickAngle = (value / 100) * 180 - 90;
              const tickRad = (tickAngle * Math.PI) / 180;
              const innerRadius = 70;
              const outerRadius = 85;
              const x1 = 100 + innerRadius * Math.cos(tickRad);
              const y1 = 100 + innerRadius * Math.sin(tickRad);
              const x2 = 100 + outerRadius * Math.cos(tickRad);
              const y2 = 100 + outerRadius * Math.sin(tickRad);

              return (
                <line
                  key={value}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#6b7280"
                  strokeWidth="2"
                />
              );
            })}

            {/* Center circle */}
            <circle cx="100" cy="100" r="8" fill="#374151" />

            {/* Animated Needle */}
            <motion.line
              x1="100"
              y1="100"
              x2="100"
              y2="30"
              stroke={needleColor}
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#glow)"
              initial={{ rotate: -90 }}
              animate={{ rotate: angle }}
              transition={{
                duration: 1.5,
                ease: [0.34, 1.56, 0.64, 1],
                delay: 0.2,
              }}
              style={{ originX: '100px', originY: '100px' }}
            />

            {/* Needle tip circle */}
            <motion.circle
              cx="100"
              cy="30"
              r="4"
              fill={needleColor}
              filter="url(#glow)"
              initial={{ rotate: -90 }}
              animate={{ rotate: angle }}
              transition={{
                duration: 1.5,
                ease: [0.34, 1.56, 0.64, 1],
                delay: 0.2,
              }}
              style={{ originX: '100px', originY: '100px' }}
            />
          </svg>

          {/* Score Display */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="text-5xl font-bold text-gray-900">
              {Math.round(animatedScore)}
            </div>
            <div className="text-sm text-gray-500 mt-1">Health Score</div>
          </motion.div>
        </div>

        {/* Risk Level Badge */}
        <motion.div
          className="mt-6 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div
            className={cn(
              'px-6 py-3 rounded-full font-semibold text-lg border-2',
              risk.color === 'red' && 'bg-red-100 border-red-500 text-red-800',
              risk.color === 'yellow' && 'bg-yellow-100 border-yellow-500 text-yellow-800',
              risk.color === 'green' && 'bg-green-100 border-green-500 text-green-800'
            )}
          >
            {isHighRisk && (
              <motion.span
                className="inline-block mr-2"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                ⚠️
              </motion.span>
            )}
            {risk.level}
          </div>
        </motion.div>

        {/* Risk Indicators */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-600">
            <div>
              <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1" />
              <div>0-30</div>
            </div>
            <div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1" />
              <div>31-70</div>
            </div>
            <div>
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1" />
              <div>71-100</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
