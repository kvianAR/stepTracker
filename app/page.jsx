import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { ActivityIcon, BarChart2Icon, TrendingUpIcon, UsersIcon } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen overflow-hidden">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 mx-auto">
          <div className="flex gap-1 items-center text-lg font-bold">
            <ActivityIcon className="h-6 w-6 text-primary" />
            <span>StepTrackerNst</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <ModeToggle />
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        <section className="w-full flex items-center py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Track Your Steps, Transform Your Life
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  StepSync helps you monitor your daily activity, set goals, and visualize your progress with beautiful charts.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/signup">
                  <Button size="lg" className="animate-pulse">Get Started</Button>
                </Link>
                <Link href="/dashboard/demo">
                  <Button size="lg" variant="outline">Try Demo</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUpIcon className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Track Daily Progress</h3>
                  <p className="text-muted-foreground">
                    Log your steps daily and see your progress over time with intuitive interfaces.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart2Icon className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Visualize Your Data</h3>
                  <p className="text-muted-foreground">
                    Beautiful interactive charts help you understand your activity patterns.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <UsersIcon className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Set and Achieve Goals</h3>
                  <p className="text-muted-foreground">
                    Set personalized step goals and track your progress toward achieving them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t w-full">
        <div className="container flex flex-col gap-2 py-6 md:h-16 md:flex-row md:py-0 mx-auto">
          <div className="flex items-center gap-1 text-sm">
            <ActivityIcon className="h-4 w-4" /> StepTrackerNST © {new Date().getFullYear()}
          </div>
          <div className="flex flex-1 items-center justify-end gap-4 text-sm">
            <Link href="#" className="text-muted-foreground hover:text-foreground">Terms</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
