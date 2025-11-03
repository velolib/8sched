import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent, CardHeader,
  CardTitle
} from "@/components/ui/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpenText, School } from 'lucide-react';

export const Route = createFileRoute("/_user/")({
  component: Index,
});

function Index() {
  return (
    <>
      <div className="space-y-4">
        <Card className="p-4">
          <CardHeader className="p-0 flex items-center justify-center text-center">
            <CardTitle className="text-4xl font-bold">8Sched</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center text-center">
            <p className='w-2xl'>
              A simple web app that compiles <a href="https://www.sman8jkt.sch.id/" className='text-primary underline'>SMA Negeri 8 Jakarta</a>'s class schedules into an easy-to-use website. Quickly check daily
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
          {/* <Button asChild variant="outline" className="w-full sm:w-auto bg-transparent">
            <a href="https://forms.gle/EDniF5DhqSox1Kr37" target="_blank" rel="noopener noreferrer">
              Give Feedback
            </a>
          </Button> */}
        </section>
      </div>
    </>
  );
}
