"use client";

import { useState, useEffect } from 'react';
import { TrophyIcon, MedalIcon, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMockLeaderboard = () => {
      try {
        setLoading(true);
        const mockLeaderboard = [
          {
            id: '1',
            rank: 1,
            name: 'Jane Smith',
            totalSteps: 458976,
            currentStreak: 12,
            isCurrentUser: false
          },
          {
            id: '2',
            rank: 2,
            name: 'John Doe',
            totalSteps: 423541,
            currentStreak: 8,
            isCurrentUser: true
          },
          {
            id: '3',
            rank: 3,
            name: 'Alex Johnson',
            totalSteps: 387652,
            currentStreak: 5,
            isCurrentUser: false
          },
          {
            id: '4',
            rank: 4,
            name: 'Sam Wilson',
            totalSteps: 356789,
            currentStreak: 3,
            isCurrentUser: false
          },
          {
            id: '5',
            rank: 5,
            name: 'Taylor Swift',
            totalSteps: 321456,
            currentStreak: 7,
            isCurrentUser: false
          }
        ];

        setLeaderboard(mockLeaderboard);
      } catch (error) {
        console.error('Error creating mock leaderboard:', error);
        setError('Failed to load leaderboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getMockLeaderboard();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <TrophyIcon className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <MedalIcon className="h-5 w-5 text-gray-400" />;
      case 3:
        return <MedalIcon className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="text-sm font-medium">{rank}</span>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Leaderboard</CardTitle>
        <CardDescription>See how you rank against other users</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-4 text-center text-muted-foreground">{error}</div>
        ) : leaderboard.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">No data available yet</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Steps</TableHead>
                  <TableHead className="text-right">Streak</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((user) => (
                  <TableRow key={user.id} className={user.isCurrentUser ? "bg-primary/5" : ""}>
                    <TableCell className="font-medium">
                      <div className="flex items-center justify-center">
                        {getRankIcon(user.rank)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{user.name}</div>
                      {user.isCurrentUser && (
                        <div className="text-xs text-muted-foreground">You</div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{user.totalSteps.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{user.currentStreak} days</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
