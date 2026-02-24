import { RiskVisualization } from './components/dashboard/risk-visualization';

export default function App() {
  // Example data - in a real app, this would come from an API or state management
  const farmerData = {
    healthScore: 45, // 0-100 (will show as yellow/moderate risk)
    activeDebt: 25000, // USDC
    collateralRatio: 115, // percentage (below 120 threshold - high risk)
    nextPaymentDate: '2026-03-03', // ISO date string (7 days from now)
  };

  return (
    <RiskVisualization
      healthScore={farmerData.healthScore}
      activeDebt={farmerData.activeDebt}
      collateralRatio={farmerData.collateralRatio}
      nextPaymentDate={farmerData.nextPaymentDate}
    />
  );
}