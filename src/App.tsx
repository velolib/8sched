import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ScheduleViewer } from './ScheduleViewer'
import { ThemeProvider } from './components/theme-provider'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ScheduleViewer />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

