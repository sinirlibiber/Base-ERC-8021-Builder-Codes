'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAnalytics, getBuilderCodes, getTransactions } from '@/lib/erc8021-storage';
import type { AnalyticsData } from '@/app/types/erc8021';
import { formatEther } from 'viem';

export function AnalyticsView(): JSX.Element {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalBuilders: 0,
    totalVolume: 0n,
    totalRevenue: 0n,
    activeBuilders: 0,
    transactionCount: 0,
  });

  useEffect(() => {
    const data = getAnalytics();
    setAnalytics(data);

    const interval = setInterval(() => {
      const updatedData = getAnalytics();
      setAnalytics(updatedData);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const builderCodes = getBuilderCodes();
  const transactions = getTransactions();

  const topBuilders = builderCodes
    .slice()
    .sort((a, b) => Number(b.totalRevenue - a.totalRevenue))
    .slice(0, 5);

  const recentActivity = transactions
    .slice()
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);

  const averageRevenuePerBuilder =
    analytics.totalBuilders > 0
      ? Number(analytics.totalRevenue) / analytics.totalBuilders / 1e18
      : 0;

  const averageVolumePerTransaction =
    analytics.transactionCount > 0
      ? Number(analytics.totalVolume) / analytics.transactionCount / 1e18
      : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Builders</CardDescription>
            <CardTitle className="text-3xl">{analytics.totalBuilders}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {analytics.activeBuilders} active builders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Volume</CardDescription>
            <CardTitle className="text-3xl">{formatEther(analytics.totalVolume)} ETH</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {averageVolumePerTransaction.toFixed(4)} ETH/işlem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl">{formatEther(analytics.totalRevenue)} ETH</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {averageRevenuePerBuilder.toFixed(6)} ETH/builder
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Transaction Count</CardDescription>
            <CardTitle className="text-3xl">{analytics.transactionCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Recorded transactions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Earning Builders</CardTitle>
            <CardDescription>Top 5 builders by revenue ranking</CardDescription>
          </CardHeader>
          <CardContent>
            {topBuilders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No builders registered yet
              </p>
            ) : (
              <div className="space-y-3">
                {topBuilders.map((builder, index) => (
                  <div key={builder.code} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          index === 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : index === 1
                              ? 'bg-gray-100 text-gray-800'
                              : index === 2
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        #{index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{builder.code}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatEther(builder.totalVolume)} ETH volume
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">
                        {formatEther(builder.totalRevenue)} ETH
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Recent transactions on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No transactions recorded yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((tx) => (
                  <div key={tx.hash} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{tx.builderCode}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleTimeString('en-US')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatEther(tx.value)} ETH</p>
                      <p className="text-xs text-green-600">
                        +{formatEther(tx.revenue)} ETH
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>📊 ERC-8021 Statistics</CardTitle>
          <CardDescription>Platform-wide performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">Revenue Share Rate</p>
              <p className="text-2xl font-bold">0.5%</p>
              <p className="text-xs text-muted-foreground">
                Share going to builder from each transaction
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Builder Success Rate</p>
              <p className="text-2xl font-bold">
                {analytics.totalBuilders > 0
                  ? ((analytics.activeBuilders / analytics.totalBuilders) * 100).toFixed(1)
                  : 0}
                %
              </p>
              <p className="text-xs text-muted-foreground">
                Active builder ratio
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Average Transaction Value</p>
              <p className="text-2xl font-bold">{averageVolumePerTransaction.toFixed(4)} ETH</p>
              <p className="text-xs text-muted-foreground">
                Average per transaction
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
