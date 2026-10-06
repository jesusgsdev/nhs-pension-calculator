import React from 'react';
import { FullRetirementProjection } from '../../types/pension';
import { ShiftCalculationResult } from '../../types/schedule';
import { StatCard } from '../common/StatCard';
import { Banknote, Coins, Receipt, Wallet } from 'lucide-react';

interface HeroStatCardsProps {
  projection: FullRetirementProjection;
  salary?: ShiftCalculationResult | null;
}

export const HeroStatCards: React.FC<HeroStatCardsProps> = ({ projection }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      
      {/* 1. Net Monthly Take-Home Pension */}
      <StatCard
        label="Net Monthly Pension"
        value={`£${projection.tax.netMonthlyPension.toLocaleString()}`}
        subtitle={`Take-home after PAYE tax (£${projection.tax.netAnnualPension.toLocaleString()}/yr)`}
        badge="Take-Home"
        badgeColor="green"
        icon={<Wallet className="w-5 h-5" />}
        highlight={true}
      />

      {/* 2. Tax-Free Lump Sum */}
      <StatCard
        label="Tax-Free Lump Sum"
        value={`£${projection.finalTaxFreeLumpSum.toLocaleString()}`}
        subtitle={
          projection.commutation.additionalTaxFreeLumpSum > 0
            ? `Includes +£${projection.commutation.additionalTaxFreeLumpSum.toLocaleString()} cash commutation`
            : 'Automatic standard scheme lump sum'
        }
        badge="Tax-Free"
        badgeColor="purple"
        icon={<Coins className="w-5 h-5" />}
      />

      {/* 3. Gross Annual Pension */}
      <StatCard
        label="Gross Annual Pension"
        value={`£${projection.finalGrossAnnualPension.toLocaleString()}`}
        subtitle={`£${Math.round(projection.finalGrossAnnualPension / 12).toLocaleString()}/mo before tax`}
        badge="Pre-Tax"
        badgeColor="blue"
        icon={<Banknote className="w-5 h-5" />}
      />

      {/* 4. Estimated Annual Tax */}
      <StatCard
        label="Estimated Annual Tax"
        value={`£${projection.tax.totalAnnualTax.toLocaleString()}`}
        subtitle={`Effective rate: ${projection.tax.effectiveTaxRatePercent}%`}
        badge="PAYE Tax"
        badgeColor="amber"
        icon={<Receipt className="w-5 h-5" />}
      />

    </div>
  );
};
