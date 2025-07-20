export function generateDemoData() {

  const today = new Date();

  const dailyData = [];
  const dailyGoal = 10000;

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    let steps;
    const dayOfWeek = date.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      steps = Math.floor(Math.random() * 6000) + 3000;
    } else {
      const baseSteps = 7000 + Math.floor(Math.random() * 5000);

      if (i < 7) {
        steps = baseSteps + 1000;
      } else if (i > 20) {
        steps = baseSteps - 1000;
      } else {
        steps = baseSteps;
      }
    }

    const formattedDate = date.toISOString().split('T')[0];

    // Generate random sleep data
    const sleepHours = Math.floor(Math.random() * 4) + 5; // Random sleep hours between 5-8
    const sleepQualityOptions = ['poor', 'fair', 'good', 'excellent'];
    const sleepQuality = sleepQualityOptions[Math.floor(Math.random() * sleepQualityOptions.length)];

    // Calculate calories burned (using standard formula: steps * 0.04)
    const caloriesBurned = Math.round(steps * 0.04);

    dailyData.push({
      date: formattedDate,
      steps,
      goal: dailyGoal,
      goalMet: steps >= dailyGoal,
      sleepHours,
      sleepQuality,
      caloriesBurned,
    });
  }

  const weeklyData = [];
  const weeks = 12; 

  for (let i = weeks - 1; i >= 0; i--) {
    const startDate = new Date();
    startDate.setDate(today.getDate() - (i * 7 + 6));

    const endDate = new Date();
    endDate.setDate(today.getDate() - i * 7);

    const totalSteps = Math.floor(Math.random() * 20000) + 30000;
    const avgSteps = Math.floor(totalSteps / 7);

    weeklyData.push({
      week: `Week ${weeks - i}`,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      totalSteps,
      avgSteps,
      goalMet: avgSteps >= dailyGoal,
    });
  }

  const monthlyData = [];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date();
    monthDate.setMonth(today.getMonth() - i);

    const monthIndex = monthDate.getMonth();
    const year = monthDate.getFullYear();

    const totalSteps = Math.floor(Math.random() * 80000) + 150000;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const avgSteps = Math.floor(totalSteps / daysInMonth);

    monthlyData.push({
      month: months[monthIndex],
      year,
      totalSteps,
      avgSteps,
      goalMet: avgSteps >= dailyGoal,
    });
  }

  // Calculate total calories burned
  const totalCaloriesBurned = dailyData.reduce((sum, day) => sum + day.caloriesBurned, 0);

  return {
    dailyData,
    weeklyData,
    monthlyData,
    currentStreak: 5,
    bestStreak: 14,
    totalSteps: 2538976,
    avgStepsPerDay: 8463,
    goalCompletionRate: 62,
    totalCaloriesBurned,
  };
}
