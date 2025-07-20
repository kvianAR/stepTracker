"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { MoonIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Mock sleep data display component
export function SleepInput({ date = format(new Date(), 'yyyy-MM-dd') }) {
  const [open, setOpen] = useState(false);

  // Mock sleep data - this would normally come from the demo data
  const mockSleepHours = 7.5;
  const mockSleepQuality = "good";

  // Function to get color based on sleep quality
  const getSleepQualityColor = (quality) => {
    switch (quality) {
      case 'poor': return 'bg-red-100 text-red-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'good': return 'bg-green-100 text-green-800';
      case 'excellent': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <MoonIcon className="h-4 w-4" /> View Sleep
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sleep Data</DialogTitle>
          <DialogDescription>
            Your sleep data for {format(new Date(date), 'MMMM d, yyyy')}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Hours of Sleep</p>
                  <p className="text-2xl font-bold">{mockSleepHours} hours</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sleep Quality</p>
                  <div className="flex items-center mt-1">
                    <Badge className={getSleepQualityColor(mockSleepQuality)}>
                      {mockSleepQuality.charAt(0).toUpperCase() + mockSleepQuality.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    Sleep data is automatically tracked and cannot be manually entered.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
