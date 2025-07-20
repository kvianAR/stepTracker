"use client";

import { useState } from 'react';
import { CircleCheck, Edit2Icon, PlusIcon, TrashIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

export default function GoalsPage() {
  const { toast } = useToast();
  const [goals, setGoals] = useState([
    { id: 1, name: 'Daily 10,000 steps', target: 10000, current: 8463, unit: 'steps', period: 'daily' },
    { id: 2, name: 'Weekly walking streak', target: 7, current: 5, unit: 'days', period: 'weekly' },
    { id: 3, name: 'Monthly step total', target: 300000, current: 254897, unit: 'steps', period: 'monthly' },
  ]);
  
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    current: '0',
    unit: 'steps',
    period: 'daily',
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  
  const handleAddGoal = (e) => {
    e.preventDefault();
    
    const goal = {
      id: Date.now(),
      name: newGoal.name,
      target: parseInt(newGoal.target),
      current: parseInt(newGoal.current),
      unit: newGoal.unit,
      period: newGoal.period,
    };
    
    setGoals([...goals, goal]);
    setNewGoal({
      name: '',
      target: '',
      current: '0',
      unit: 'steps',
      period: 'daily',
    });
    
    setIsOpen(false);
    
    toast({
      title: "Goal added",
      description: `New goal "${goal.name}" has been added`,
    });
  };
  
  const handleEditGoal = (e) => {
    e.preventDefault();
    
    const updatedGoals = goals.map(g => 
      g.id === editGoal.id ? editGoal : g
    );
    
    setGoals(updatedGoals);
    setEditGoal(null);
    
    toast({
      title: "Goal updated",
      description: `Goal "${editGoal.name}" has been updated`,
    });
  };
  
  const handleDeleteGoal = (id) => {
    const goalToDelete = goals.find(g => g.id === id);
    const updatedGoals = goals.filter(g => g.id !== id);
    
    setGoals(updatedGoals);
    
    toast({
      title: "Goal deleted",
      description: `Goal "${goalToDelete.name}" has been deleted`,
      variant: "destructive",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Goals</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <PlusIcon className="h-4 w-4" /> Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>
                Set a new fitness goal to track your progress
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddGoal}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Goal Name</Label>
                  <Input
                    id="name"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                    placeholder="Daily 10,000 steps"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="target">Target</Label>
                    <Input
                      id="target"
                      type="number"
                      min="1"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                      placeholder="10000"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unit</Label>
                    <select
                      id="unit"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newGoal.unit}
                      onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    >
                      <option value="steps">Steps</option>
                      <option value="days">Days</option>
                      <option value="km">Kilometers</option>
                      <option value="miles">Miles</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="period">Period</Label>
                  <select
                    id="period"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newGoal.period}
                    onChange={(e) => setNewGoal({ ...newGoal, period: e.target.value })}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Goal</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Edit Goal Dialog */}
        {editGoal && (
          <Dialog open={!!editGoal} onOpenChange={() => setEditGoal(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Goal</DialogTitle>
                <DialogDescription>
                  Update your fitness goal
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditGoal}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Goal Name</Label>
                    <Input
                      id="edit-name"
                      value={editGoal.name}
                      onChange={(e) => setEditGoal({ ...editGoal, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-target">Target</Label>
                      <Input
                        id="edit-target"
                        type="number"
                        min="1"
                        value={editGoal.target}
                        onChange={(e) => setEditGoal({ ...editGoal, target: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-current">Current Progress</Label>
                      <Input
                        id="edit-current"
                        type="number"
                        min="0"
                        value={editGoal.current}
                        onChange={(e) => setEditGoal({ ...editGoal, current: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-unit">Unit</Label>
                      <select
                        id="edit-unit"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={editGoal.unit}
                        onChange={(e) => setEditGoal({ ...editGoal, unit: e.target.value })}
                      >
                        <option value="steps">Steps</option>
                        <option value="days">Days</option>
                        <option value="km">Kilometers</option>
                        <option value="miles">Miles</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-period">Period</Label>
                      <select
                        id="edit-period"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={editGoal.period}
                        onChange={(e) => setEditGoal({ ...editGoal, period: e.target.value })}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Update Goal</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const progress = Math.round((goal.current / goal.target) * 100);
          const isCompleted = progress >= 100;
          
          return (
            <Card key={goal.id} className={`${isCompleted ? 'border-green-500 dark:border-green-700' : ''} transition-all hover:shadow-md`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">{goal.name}</CardTitle>
                  {isCompleted && (
                    <CircleCheck className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <CardDescription>
                  {goal.period.charAt(0).toUpperCase() + goal.period.slice(1)} goal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current</span>
                    <span className="font-medium">{goal.current.toLocaleString()} {goal.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Target</span>
                    <span className="font-medium">{goal.target.toLocaleString()} {goal.unit}</span>
                  </div>
                  {!isCompleted && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className="font-medium">{(goal.target - goal.current).toLocaleString()} {goal.unit}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => handleDeleteGoal(goal.id)}>
                  <TrashIcon className="h-4 w-4 mr-1" /> Delete
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditGoal(goal)}>
                  <Edit2Icon className="h-4 w-4 mr-1" /> Edit
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {goals.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <PlusIcon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">No goals yet</h3>
          <p className="text-muted-foreground mb-4">Create your first goal to start tracking your progress</p>
          <Button onClick={() => setIsOpen(true)}>Add Your First Goal</Button>
        </div>
      )}
    </div>
  );
}