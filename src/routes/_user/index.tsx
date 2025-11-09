import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent, CardHeader,
  CardTitle
} from "@/components/ui/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpenText, School } from 'lucide-react';
import newsUsersDark from '@/assets/news/news-users-dark.png';
import newsUsersLight from '@/assets/news/news-users-light.png';

export const Route = createFileRoute("/_user/")({
  component: Index,
});

function Index() {
  return (
    <>
      <div className="space-y-4">
        <Card className="p-4 gap-4">
          <CardHeader className="p-0 flex flex-col items-center justify-center text-center">
            <CardTitle className="text-4xl font-bold">
              8Sched
            </CardTitle>
            <span>by{" "}
              <a
                href="https://velolib.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                malik
              </a>
            </span>
          </CardHeader>
          <CardContent className="flex items-center justify-center text-center">
            <p className='w-2xl'>
              A simple web app that compiles <a href="https://www.sman8jkt.sch.id/" target="_blank" rel="noopener noreferrer" className='text-primary underline'>SMA Negeri 8 Jakarta</a>'s class schedules into an easy-to-use website. Quickly check daily
              timetables, see subject and teacher assignments, and keep track of schedule updates — all in one place.
            </p>
          </CardContent>
        </Card>

        <section aria-label="Primary navigation" className="flex flex-col gap-4 sm:flex-row">
          <Button asChild className="flex-1 h-16 text-lg">
            <Link to="/student"><BookOpenText className='size-5.5'/> Student Schedule</Link>
          </Button>
          <Button asChild className="flex-1 h-16 text-lg">
            <Link to="/teacher"><School className='size-5.5'/> Teacher Schedule</Link>
          </Button>
        </section>

        <Card className="p-4 gap-4">
          <CardHeader className="p-0 flex flex-col items-center justify-center text-center">
            <CardTitle className="text-2xl font-bold">
              Latest News
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center text-center flex-col">
            <div className="w-full overflow-x-auto rounded-xl border">
              <img src={newsUsersLight} alt="A graph showing active users over the last 3 weeks, with a peak at 90 users." className="block dark:hidden max-w-none h-64 sm:h-auto"/>
              <img src={newsUsersDark} alt="A graph showing active users over the last 3 weeks, with a peak at 90 users." className="hidden dark:block max-w-none h-64 sm:h-auto"/>
            </div>
            <p className='mt-4 text-left'>
              The graph above shows the daily active users over the past 3 weeks, peaking at 90. In total, over 200 users have used 8Sched to check their schedules. Thank you for your support!
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
