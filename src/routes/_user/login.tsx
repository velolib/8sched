import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_user/login")({
  loader: () => {
    fetch("/api/auth/status", {}).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          if (data.loggedIn) {
            throw redirect({ to: "/admin" });
          }
        });
      }
    });
  },
});
