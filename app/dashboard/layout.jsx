import { AuthCheck } from '@/components/auth-check';
import { DashboardNav } from '@/components/dashboard-nav';

export const metadata = {
  title: 'Dashboard | StepSync',
  description: 'Track your steps and monitor your progress',
};

export default function DashboardLayout({ children }) {
  return (
    <AuthCheck>
      <div className="flex min-h-screen items-center w-full flex-col overflow-hidden">
        <DashboardNav />
        <div className="flex-1 container py-6">
          {children}
        </div>
      </div>
    </AuthCheck>
  );
}