"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ActivityIcon, BarChart2Icon, CalendarIcon, HomeIcon, LogOutIcon, MenuIcon, TargetIcon, UserIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ModeToggle } from '@/components/mode-toggle';

export function DashboardNav() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  
  useEffect(() => {
    if (pathname === '/dashboard/demo') {
      setIsDemo(true);
      setUser({ name: 'Demo User' });
    } else {
      const storedUser = localStorage.getItem('stepSync_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      
    }
  }, [pathname]);

  const handleLogout = () => {
    if (!isDemo) {
      localStorage.removeItem('stepSync_user');
    }
    window.location.href = '/';
  };

  const navigation = [
    { name: 'Dashboard', href: isDemo ? '/dashboard/demo' : '/dashboard', icon: HomeIcon },
    { name: 'Activity', href: isDemo ? '/dashboard/demo/activity' : '/dashboard/activity', icon: BarChart2Icon },
    { name: 'Goals', href: isDemo ? '/dashboard/demo/goals' : '/dashboard/goals', icon: TargetIcon },
    // { name: 'History', href: isDemo ? '/dashboard/demo/history' : '/dashboard/history', icon: CalendarIcon },
    // { name: 'Profile', href: isDemo ? '/dashboard/demo/profile' : '/dashboard/profile', icon: UserIcon },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center mx-auto"> {/* Added mx-auto here */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon" className="mr-2">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-2 py-4">
                <ActivityIcon className="h-5 w-5 text-primary" />
                <span className="font-bold">StepTrackerNST</span>
              </div>
              <nav className="flex-1">
                <div className="flex flex-col gap-1 py-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                        pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </nav>
              <div className="border-t py-4">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={handleLogout}>
                  <LogOutIcon className="h-4 w-4" />
                  Log out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center gap-2">
          <Link href={isDemo ? '/dashboard/demo' : '/dashboard'} className="flex items-center gap-2 font-bold">
            <ActivityIcon className="hidden h-5 w-5 text-primary sm:inline-block" />
            <span>StepSync</span>
          </Link>
        </div>
        
        <nav className="hidden flex-1 items-center justify-center lg:flex">
          <div className="flex gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
        
        <div className="flex items-center gap-4">
          <ModeToggle />
          <span className="hidden text-sm font-medium md:inline-block">
            {user?.name || 'User'}
          </span>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOutIcon className="h-5 w-5" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
