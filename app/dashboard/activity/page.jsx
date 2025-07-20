"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { format } from 'date-fns';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateDemoData } from '@/lib/demo-data';

export default function ActivityPage() {
  const pathname = usePathname();
  const isDemo = pathname.includes('/demo');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // For a real app, this would fetch from an API
    const demoData = generateDemoData();
    setData(demoData);
    setLoading(false);
  }, []);
  
  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  // Process data for charts
  const dailyChartData = data.dailyData.map(day => ({
    date: format(new Date(day.date), 'MMM dd'),
    steps: day.steps,
    goal: day.goal,
  }));
  
  const weeklyChartData = data.weeklyData.map(week => ({
    week: week.week,
    avgSteps: week.avgSteps,
    totalSteps: week.totalSteps / 7,
    goal: 10000,
  }));
  
  const monthlyChartData = data.monthlyData.map(month => ({
    month: month.month,
    avgSteps: month.avgSteps,
    goal: 10000,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Activity</h2>
        <p className="text-muted-foreground">
          Track and analyze your step activity over time
        </p>
      </div>
      
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Step Count</CardTitle>
              <CardDescription>Your steps for the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70} 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      tickFormatter={(value) => `${value/1000}k`}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const steps = payload[0].value;
                          const goal = payload[1].value;
                          return (
                            <div className="rounded-lg border bg-card p-3 shadow-sm">
                              <p className="font-medium">{label}</p>
                              <p className="text-sm text-muted-foreground">Steps: <span className="font-medium text-foreground">{steps.toLocaleString()}</span></p>
                              <p className="text-sm text-muted-foreground">Goal: <span className="font-medium text-foreground">{goal.toLocaleString()}</span></p>
                              <p className="text-sm font-medium mt-1">
                                {steps >= goal ? '✅ Goal achieved!' : `❌ ${(goal - steps).toLocaleString()} steps short`}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="steps" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="goal" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} opacity={0.3} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Step Average</CardTitle>
              <CardDescription>Your average steps per day for each week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="week" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      tickFormatter={(value) => `${value/1000}k`}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const avgSteps = payload[0].value;
                          const goal = payload[1].value;
                          return (
                            <div className="rounded-lg border bg-card p-3 shadow-sm">
                              <p className="font-medium">{label}</p>
                              <p className="text-sm text-muted-foreground">Avg Steps: <span className="font-medium text-foreground">{avgSteps.toLocaleString()}</span></p>
                              <p className="text-sm text-muted-foreground">Goal: <span className="font-medium text-foreground">{goal.toLocaleString()}</span></p>
                              <p className="text-sm font-medium mt-1">
                                {avgSteps >= goal ? '✅ Goal achieved!' : `❌ ${(goal - avgSteps).toLocaleString()} steps short`}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avgSteps" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={3}
                      dot={{ stroke: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4, fill: 'hsl(var(--background))' }}
                      activeDot={{ r: 8, fill: 'hsl(var(--chart-1))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="goal" 
                      stroke="hsl(var(--chart-2))" 
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Step Average</CardTitle>
              <CardDescription>Your average steps per day for each month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      tickFormatter={(value) => `${value/1000}k`}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const avgSteps = payload[0].value;
                          const goal = payload[1].value;
                          return (
                            <div className="rounded-lg border bg-card p-3 shadow-sm">
                              <p className="font-medium">{label}</p>
                              <p className="text-sm text-muted-foreground">Avg Steps: <span className="font-medium text-foreground">{avgSteps.toLocaleString()}</span></p>
                              <p className="text-sm text-muted-foreground">Goal: <span className="font-medium text-foreground">{goal.toLocaleString()}</span></p>
                              <p className="text-sm font-medium mt-1">
                                {avgSteps >= goal ? '✅ Goal achieved!' : `❌ ${(goal - avgSteps).toLocaleString()} steps short`}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="avgSteps" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="goal" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} opacity={0.3} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}