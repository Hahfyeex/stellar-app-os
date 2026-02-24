import { motion } from 'motion/react';
import { RiskGauge } from './risk-gauge';
import { QuickStats } from './quick-stats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../ui/utils';

interface RiskVisualizationProps {
  healthScore: number; // 0-100
  activeDebt: number; // USDC
  collateralRatio: number; // percentage
  nextPaymentDate: string; // ISO date string
}

export function RiskVisualization({
  healthScore,
  activeDebt,
  collateralRatio,
  nextPaymentDate,
}: RiskVisualizationProps) {
  const isHighRisk = collateralRatio < 120;
  const isModerateRisk = collateralRatio >= 120 && collateralRatio < 150;

  // Generate recommendations based on risk level
  const getRecommendations = () => {
    const recommendations = [];

    if (collateralRatio < 120) {
      recommendations.push({
        type: 'critical',
        icon: AlertCircle,
        title: 'Collateral Ratio Below Threshold',
        description: 'Add collateral immediately to avoid liquidation risk.',
        action: 'Add Collateral',
      });
    }

    if (collateralRatio >= 120 && collateralRatio < 150) {
      recommendations.push({
        type: 'warning',
        icon: TrendingDown,
        title: 'Low Collateral Ratio',
        description: 'Consider adding more collateral to improve your position.',
        action: 'Review Position',
      });
    }

    const daysUntilPayment = Math.ceil(
      (new Date(nextPaymentDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilPayment <= 7 && daysUntilPayment > 0) {
      recommendations.push({
        type: 'warning',
        icon: AlertCircle,
        title: 'Payment Due Soon',
        description: `Your next payment is due in ${daysUntilPayment} days.`,
        action: 'Make Payment',
      });
    }

    if (healthScore >= 70 && collateralRatio >= 150) {
      recommendations.push({
        type: 'success',
        icon: TrendingUp,
        title: 'Strong Financial Position',
        description: 'Your farm credit health is excellent. Keep up the good work!',
        action: null,
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Farm Credit Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Real-time monitoring of your financial health and risk indicators
          </p>
        </motion.div>

        {/* Risk Gauge */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RiskGauge healthScore={healthScore} collateralRatio={collateralRatio} />
          </div>

          {/* Risk Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="h-full border-2">
              <CardHeader>
                <CardTitle>Risk Summary</CardTitle>
                <CardDescription>Key metrics at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Health Score</span>
                    <span className="text-xl font-bold text-gray-900">{healthScore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Collateral Ratio</span>
                    <span
                      className={cn(
                        'text-xl font-bold',
                        collateralRatio < 120 && 'text-red-600',
                        collateralRatio >= 120 && collateralRatio < 150 && 'text-yellow-600',
                        collateralRatio >= 150 && 'text-green-600'
                      )}
                    >
                      {collateralRatio.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Debt</span>
                    <span className="text-xl font-bold text-gray-900">
                      ${activeDebt.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Risk Status
                    </p>
                    <div
                      className={cn(
                        'p-3 rounded-lg',
                        isHighRisk && 'bg-red-100',
                        isModerateRisk && 'bg-yellow-100',
                        !isHighRisk && !isModerateRisk && 'bg-green-100'
                      )}
                    >
                      <p
                        className={cn(
                          'text-sm font-medium',
                          isHighRisk && 'text-red-800',
                          isModerateRisk && 'text-yellow-800',
                          !isHighRisk && !isModerateRisk && 'text-green-800'
                        )}
                      >
                        {isHighRisk && '🚨 Immediate action required'}
                        {isModerateRisk && '⚠️ Monitor closely'}
                        {!isHighRisk && !isModerateRisk && '✅ Healthy position'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <QuickStats
          activeDebt={activeDebt}
          collateralRatio={collateralRatio}
          nextPaymentDate={nextPaymentDate}
        />

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>
                  Actions to improve your financial health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => {
                    const Icon = rec.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                        className={cn(
                          'p-4 rounded-lg border-l-4 flex items-start gap-4',
                          rec.type === 'critical' && 'bg-red-50 border-red-500',
                          rec.type === 'warning' && 'bg-yellow-50 border-yellow-500',
                          rec.type === 'success' && 'bg-green-50 border-green-500'
                        )}
                      >
                        <div
                          className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                            rec.type === 'critical' && 'bg-red-100',
                            rec.type === 'warning' && 'bg-yellow-100',
                            rec.type === 'success' && 'bg-green-100'
                          )}
                        >
                          <Icon
                            className={cn(
                              'w-5 h-5',
                              rec.type === 'critical' && 'text-red-600',
                              rec.type === 'warning' && 'text-yellow-600',
                              rec.type === 'success' && 'text-green-600'
                            )}
                          />
                        </div>
                        <div className="flex-1">
                          <h4
                            className={cn(
                              'font-semibold mb-1',
                              rec.type === 'critical' && 'text-red-900',
                              rec.type === 'warning' && 'text-yellow-900',
                              rec.type === 'success' && 'text-green-900'
                            )}
                          >
                            {rec.title}
                          </h4>
                          <p
                            className={cn(
                              'text-sm',
                              rec.type === 'critical' && 'text-red-700',
                              rec.type === 'warning' && 'text-yellow-700',
                              rec.type === 'success' && 'text-green-700'
                            )}
                          >
                            {rec.description}
                          </p>
                        </div>
                        {rec.action && (
                          <button
                            className={cn(
                              'px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap',
                              rec.type === 'critical' && 'bg-red-600 text-white hover:bg-red-700',
                              rec.type === 'warning' && 'bg-yellow-600 text-white hover:bg-yellow-700'
                            )}
                          >
                            {rec.action}
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
