"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { format, subDays } from 'date-fns';
import { ActivityIcon, CalendarIcon, ChevronRightIcon, FlameIcon, TrendingUpIcon } from 'lucide-react'; // Changed FileIcon to FlameIcon
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateDemoData } from '@/lib/demo-data';
import { StepInput } from '@/components/step-input';
import { SleepInput } from '@/components/sleep-input';
import { Leaderboard } from '@/components/leaderboard';
import { SleepChart } from '@/components/sleep-chart';

export default function DashboardPage() {
  const pathname = usePathname();
  const isDemo = pathname === '/dashboard/demo';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const today = new Date();
  const formattedToday = format(today, 'yyyy-MM-dd');
  const todayData = data.dailyData.find(day => day.date === formattedToday) || { steps: 0, goal: 10000 };
  const progressPercentage = Math.min(Math.round((todayData.steps / todayData.goal) * 100), 100);

  const CALORIES_PER_STEP = 0.04;
  const caloriesBurned = (todayData.steps * CALORIES_PER_STEP).toFixed(1); 

  const lastWeekData = data.dailyData.slice(-7).map(day => ({
    date: format(new Date(day.date), 'EEE'),
    steps: day.steps,
  }));

  return (
    <div className="py-6 space-y-6">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            {format(today, 'MMMM d,PPPP')}
          </p>
          <div className="flex space-x-2">
            {!isDemo && <StepInput date={formattedToday} />}
            <SleepInput date={formattedToday} />
          </div>
        </div>
      </div>

      {/* Today's progress card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5 pb-4">
          <CardTitle className="text-xl">Today&apos;s Progress</CardTitle>
          <CardDescription>
            {progressPercentage >= 100
              ? "Congratulations! You've met your goal for today."
              : `${10000 - todayData.steps} more steps to reach your daily goal`}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-primary/10">
              <div className="absolute inset-2 rounded-full border-8 border-primary/20"></div>
              <div
                className="absolute inset-2 rounded-full border-8 border-primary transition-all duration-1000 ease-in-out"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${progressPercentage > 50 ? '100% 0%' : `${50 + progressPercentage}% 0%`}, ${
                    progressPercentage > 75 ? '100% 100%' : progressPercentage > 50 ? `100% ${(progressPercentage - 50) * 4}%` : '50% 50%'
                  }, ${
                    progressPercentage > 75 ? `${150 - progressPercentage * 2}% 100%` : '50% 50%'
                  }, 50% 50%)`
                }}
              ></div>
              <div className="flex flex-col">
                <span className="text-4xl font-bold">{todayData.steps.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">steps</span>
                {/* --- New: Display calories burned --- */}
                <span className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <FlameIcon className="h-4 w-4 text-orange-500" /> {caloriesBurned} kcal
                </span>
              </div>
            </div>

            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span>0</span>
                <span>{todayData.goal.toLocaleString()} steps</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-sm text-muted-foreground">{progressPercentage}% of daily goal</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <FlameIcon className="h-4 w-4 text-orange-500" /> {/* Changed FireIcon to FlameIcon */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.currentStreak} days</div>
            <p className="text-xs text-muted-foreground">Best: {data.bestStreak} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Steps</CardTitle>
            <ActivityIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.avgStepsPerDay.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Per day over the last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Steps</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalSteps.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goal Completion</CardTitle>
            <CalendarIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.goalCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">Of days where goal was met</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly chart */}
      <Card>
        <CardHeader>
          <CardTitle>Last 7 Days</CardTitle>
          <CardDescription>Your step activity for the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lastWeekData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="stepGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value/1000}k`}
                  domain={[0, 'dataMax + 2000']}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const steps = payload[0].value;
                      const calories = (steps * CALORIES_PER_STEP).toFixed(1); // Calculate calories for tooltip

                      return (
                        <div className="rounded-lg border bg-card p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{payload[0].payload.date}</span>
                              <span className="text-xs text-muted-foreground">Steps</span>
                              <span className="text-xs text-muted-foreground">Calories</span> {/* New: Calories label */}
                            </div>
                            <div className="flex flex-col text-right">
                              <span className="text-sm font-medium">{steps.toLocaleString()}</span>
                              <span className="text-sm font-medium">{calories} kcal</span> {/* New: Calories value */}
                              <span className="text-xs text-muted-foreground">
                                {steps >= 10000 ? '✅ Goal met' : '❌ Goal missed'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="steps"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#stepGradient)"
                  activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant="ghost" size="sm" className="gap-1">
            View detailed report <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      {/* Sleep Tracker Chart */}
      <div className="grid gap-4 md:grid-cols-2">
        <SleepChart />
        <Leaderboard />
      </div>
    </div>
  );
}