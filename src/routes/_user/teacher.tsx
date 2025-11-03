import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_user/teacher')({
  head: () => ({
    meta: [
      {
        title: 'Teacher Schedules - 8Sched by malik',
      },
    ],
  }),
})
