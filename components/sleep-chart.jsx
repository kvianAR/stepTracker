"use client";

import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { generateDemoData } from '@/lib/demo-data';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-medium">{label}</p>
        <p className="text-sm">
          <span className="text-blue-500">Sleep: </span>
          {payload[0].value} hours
        </p>
        {payload[1] && (
          <p className="text-sm">
            <span className="text-green-500">Quality: </span>
            {payload[1].payload.sleepQuality}
          </p>
        )}
      </div>
    );
  }

  return null;
};

export function SleepChart() {
  const [sleepData, setSleepData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    // Use mock data instead of fetching from API
    const getMockSleepData = () => {
      try {
        setLoading(true);

        // Get demo data
        const demoData = generateDemoData();

        // Filter data based on selected time range
        const today = new Date();
        let startDate;

        switch (timeRange) {
          case 'week':
            startDate = subDays(today, 7);
            break;
          case 'month':
            startDate = subDays(today, 30);
            break;
          case 'year':
            startDate = subDays(today, 365);
            break;
          default:
            startDate = subDays(today, 7);
        }

        // Filter and format the data
        const filteredData = demoData.dailyData
          .filter(day => new Date(day.date) >= startDate)
          .map(day => ({
            date: format(new Date(day.date), 'MMM dd'),
            sleepHours: day.sleepHours,
            sleepQuality: day.sleepQuality,
            // Map sleep quality to numeric value for the chart
            qualityScore: mapQualityToScore(day.sleepQuality),
          }));

        setSleepData(filteredData);
      } catch (error) {
        console.error('Error processing mock sleep data:', error);
        setError('Failed to load sleep data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getMockSleepData();
  }, [timeRange]);

  // Map sleep quality string to numeric score for visualization
  const mapQualityToScore = (quality) => {
    switch (quality) {
      case 'poor': return 1;
      case 'fair': return 2;
      case 'good': return 3;
      case 'excellent': return 4;
      default: return 0;
    }
  };

  // Calculate average sleep hours
  const averageSleep = sleepData.length > 0
    ? (sleepData.reduce((sum, day) => sum + day.sleepHours, 0) / sleepData.length).toFixed(1)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Sleep Tracker</CardTitle>
        <CardDescription>
          Track your sleep patterns over time
          {sleepData.length > 0 && ` • Average: ${averageSleep} hours`}
        </CardDescription>
        <Tabs defaultValue="week" className="w-full" onValueChange={setTimeRange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : error ? (
          <div className="py-4 text-center text-muted-foreground">{error}</div>
        ) : sleepData.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">No sleep data available yet</div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={sleepData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 12]} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sleepHours"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#sleepGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
