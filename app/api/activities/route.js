import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import Activity from '@/models/Activity';
import User from '@/models/User';

export const dynamic = "force-dynamic";

// JWT secret key - should match the one used in login
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to get the user ID from the token
const getUserIdFromToken = () => {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
};

// GET all activities for the current user
export async function GET(request) {
  try {
    const userId = getUserIdFromToken();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    const query = { userId };
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.date = { $gte: startDate };
    } else if (endDate) {
      query.date = { $lte: endDate };
    }

    // Get activities
    const activities = await Activity.find(query).sort({ date: -1 });

    return NextResponse.json({ activities }, { status: 200 });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching activities' },
      { status: 500 }
    );
  }
}

// POST a new activity or update an existing one
export async function POST(request) {
  try {
    const userId = getUserIdFromToken();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { date, steps, sleepHours, sleepQuality } = await request.json();

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }

    // Default goal value
    const goal = 10000;

    // Check if activity already exists for this date
    let activity = await Activity.findOne({ userId, date });

    if (activity) {
      // Update existing activity
      activity.steps = steps !== undefined ? steps : activity.steps;
      activity.sleepHours = sleepHours !== undefined ? sleepHours : activity.sleepHours;
      activity.sleepQuality = sleepQuality !== undefined ? sleepQuality : activity.sleepQuality;
      activity.goalMet = activity.steps >= activity.goal;
    } else {
      // Create new activity
      activity = new Activity({
        userId,
        date,
        steps: steps !== undefined ? steps : 0,
        goal,
        goalMet: (steps !== undefined ? steps : 0) >= goal,
        sleepHours: sleepHours !== undefined ? sleepHours : 0,
        sleepQuality: sleepQuality !== undefined ? sleepQuality : 'fair',
      });
    }

    await activity.save();

    // Update user statistics
    await updateUserStats(userId);

    return NextResponse.json(
      { message: 'Activity saved successfully', activity },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving activity:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while saving activity' },
      { status: 500 }
    );
  }
}

// Helper function to update user statistics
async function updateUserStats(userId) {
  try {
    // Get all activities for the user
    const activities = await Activity.find({ userId }).sort({ date: 1 });

    if (activities.length === 0) {
      return;
    }

    // Calculate total steps
    const totalSteps = activities.reduce((sum, activity) => sum + activity.steps, 0);

    // Calculate average steps per day
    const avgStepsPerDay = Math.round(totalSteps / activities.length);

    // Calculate goal completion rate
    const goalsMetCount = activities.filter(a => a.goalMet).length;
    const goalCompletionRate = Math.round((goalsMetCount / activities.length) * 100);

    // Calculate streaks
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    // Sort activities by date in descending order for current streak
    const sortedActivities = [...activities].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    // Calculate current streak
    for (const activity of sortedActivities) {
      if (activity.goalMet) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate best streak
    for (const activity of activities) {
      if (activity.goalMet) {
        tempStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    await User.findByIdAndUpdate(userId, {
      totalSteps,
      avgStepsPerDay,
      goalCompletionRate,
      currentStreak,
      bestStreak,
    }, { runValidators: true });
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
}
