import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_user/student')({
  head: () => ({
    meta: [
      {
        title: 'Student Schedules - 8Sched by malik',
      },
    ],
  }),
})
