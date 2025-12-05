'use client';

import { useState } from 'react';
import { StatCard } from '@/components/StatCard';
import { TransactionTrendChart } from '@/components/TransactionTrendChart';
import { AccountDistributionChart } from '@/components/AccountDistributionChart';
import { Button } from '@/components/ui/button';
import { CreditCard, Landmark, Users, DollarSign } from 'lucide-react';
import { useStatistics } from '@/lib/hooks/useStatistics';
import { formatCurrency } from '@/lib/utils';

const timeRangeOptions = [
  { label: '7 Days', days: 7 },
  { label: '6 Bulan', days: 180 },
  { label: '1 Year', days: 365 },
  { label: '3 Year', days: 1095 },
];

export default function Home() {
  const [timeRange, setTimeRange] = useState(7);
  const { data, stats, metadata, error, isLoading, refetch } = useStatistics(timeRange);

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, here is the summary data of Belimbing Bank system.</p>
          {/* {metadata && <p className="text-sm text-gray-400">Last updated: {new Date(metadata.requestTime).toLocaleString()}</p>} */}
        </div>
        <div className="flex items-center gap-2">
          {timeRangeOptions.map((option) => (
            <Button key={option.label} variant={timeRange === option.days ? 'default' : 'outline'} size="sm" onClick={() => setTimeRange(option.days)}>
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Customers" value={stats?.totalCustomers ?? 0} icon={Users} loading={isLoading} />
        <StatCard title="Total Accounts" value={stats?.totalAccounts ?? 0} icon={CreditCard} loading={isLoading} />
        <StatCard title="Total Balance" value={formatCurrency(stats?.totalBalance ?? 0)} icon={DollarSign} loading={isLoading} />
        <StatCard title="Deposito Products" value={stats?.accountDistribution?.length ?? 0} icon={Landmark} loading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TransactionTrendChart data={stats?.transactionTrend ?? []} loading={isLoading} timeRange={timeRange} />
        </div>
        <div className="lg:col-span-1">
          <AccountDistributionChart data={stats?.accountDistribution ?? []} loading={isLoading} />
        </div>
      </div>

      {error && <p className="text-red-500">Failed to load dashboard data.</p>}
    </div>
  );
}
