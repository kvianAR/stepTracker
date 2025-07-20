import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
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

export async function GET() {
  try {
    const userId = getUserIdFromToken();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Get all users sorted by total steps in descending order
    const users = await User.find({}, {
      _id: 1,
      name: 1,
      totalSteps: 1,
      currentStreak: 1,
      bestStreak: 1,
      avgStepsPerDay: 1,
      goalCompletionRate: 1,
    }).sort({ totalSteps: -1 });

    // Add rank to each user
    const leaderboard = users.map((user, index) => ({
      id: user._id,
      rank: index + 1,
      name: user.name,
      totalSteps: user.totalSteps,
      currentStreak: user.currentStreak,
      bestStreak: user.bestStreak,
      avgStepsPerDay: user.avgStepsPerDay,
      goalCompletionRate: user.goalCompletionRate,
      isCurrentUser: user._id.toString() === userId,
    }));

    return NextResponse.json({ leaderboard }, { status: 200 });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching leaderboard' },
      { status: 500 }
    );
  }
}
