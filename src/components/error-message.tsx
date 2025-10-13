import { Button } from "./ui/button";

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">An error occurred</h1>
      <p className="text-muted-foreground text-center">{message}</p>
      <Button onClick={() => window.location.reload()}>Reload</Button>
    </div>
  );
}
