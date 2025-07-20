"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function AuthCheck({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('stepSync_user');
      
      if (pathname === '/dashboard/demo') {
        setIsLoading(false);
        return;
        
      }
      
      if (!user && pathname.startsWith('/dashboard')) {
        toast({
          title: "Authentication required",
          description: "Please log in to access this page.",
          variant: "destructive",
        });
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [pathname, router, toast]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return children;
}