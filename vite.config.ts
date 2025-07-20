import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { execSync } from "child_process";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig(() => {
  const commitDate = execSync("git log -1 --format=%cI")
    .toString()
    .replace(/^\s+|\s+$/g, "")
    .trimEnd();
  const commitHash = execSync("git rev-parse --short HEAD")
    .toString()
    .replace(/^\s+|\s+$/g, "")
    .trimEnd();

  process.env.VITE_GIT_COMMIT_DATE = commitDate;
  process.env.VITE_GIT_COMMIT_HASH = commitHash;

  return {
    plugins: [tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }), react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
