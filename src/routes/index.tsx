import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
  loader: () => {
    throw redirect({to: '/student'})
  }
})

function Index() {
  return (
    <></>
  )
}