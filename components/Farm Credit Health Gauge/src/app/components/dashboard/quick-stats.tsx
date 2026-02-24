import { motion } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { DollarSign, Shield, Calendar } from 'lucide-react';
import { cn } from '../ui/utils';

interface QuickStatsProps {
  activeDebt: number; // in USDC
  collateralRatio: number; // percentage
  nextPaymentDate: string; // ISO date string
  className?: string;
}

export function QuickStats({
  activeDebt,
  collateralRatio,
  nextPaymentDate,
  className,
}: QuickStatsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate days until next payment
  const getDaysUntilPayment = (dateString: string) => {
    const today = new Date();
    const paymentDate = new Date(dateString);
    const diffTime = paymentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilPayment = getDaysUntilPayment(nextPaymentDate);
  const isPaymentSoon = daysUntilPayment <= 7;
  const isCollateralLow = collateralRatio < 120;

  const stats = [
    {
      label: 'Active Debt',
      value: formatCurrency(activeDebt),
      subValue: 'USDC',
      icon: DollarSign,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      trend: null,
    },
    {
      label: 'Collateral Ratio',
      value: `${collateralRatio.toFixed(1)}%`,
      subValue: isCollateralLow ? 'Below Threshold' : 'Healthy',
      icon: Shield,
      iconColor: isCollateralLow ? 'text-red-600' : 'text-green-600',
      iconBg: isCollateralLow ? 'bg-red-100' : 'bg-green-100',
      trend: isCollateralLow ? 'warning' : null,
    },
    {
      label: 'Next Payment',
      value: formatDate(nextPaymentDate),
      subValue: `${daysUntilPayment} days`,
      icon: Calendar,
      iconColor: isPaymentSoon ? 'text-orange-600' : 'text-purple-600',
      iconBg: isPaymentSoon ? 'bg-orange-100' : 'bg-purple-100',
      trend: isPaymentSoon ? 'warning' : null,
    },
  ];

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-6', className)}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2 + index * 0.1,
              duration: 0.5,
              ease: 'easeOut',
            }}
          >
            <Card
              className={cn(
                'border-2 hover:shadow-lg transition-all',
                stat.trend === 'warning' && 'border-orange-300 bg-orange-50'
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          stat.iconBg
                        )}
                      >
                        <Icon className={cn('w-5 h-5', stat.iconColor)} />
                      </div>
                      {stat.trend === 'warning' && (
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                          }}
                        >
                          <span className="text-lg">⚠️</span>
                        </motion.div>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </p>
                    <p
                      className={cn(
                        'text-sm',
                        stat.trend === 'warning' ? 'text-orange-700 font-semibold' : 'text-gray-500'
                      )}
                    >
                      {stat.subValue}
                    </p>
                  </div>
                </div>

                {/* Progress bar for collateral ratio */}
                {stat.label === 'Collateral Ratio' && (
                  <div className="mt-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className={cn(
                          'h-full rounded-full',
                          isCollateralLow ? 'bg-red-500' : 'bg-green-500'
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(collateralRatio, 200) / 2}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>200%</span>
                    </div>
                  </div>
                )}

                {/* Timeline indicator for next payment */}
                {stat.label === 'Next Payment' && (
                  <div className="mt-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className={cn(
                          'h-full rounded-full',
                          isPaymentSoon ? 'bg-orange-500' : 'bg-purple-500'
                        )}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.max(0, 100 - (daysUntilPayment / 30) * 100)}%`,
                        }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Today</span>
                      <span>30 days</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
