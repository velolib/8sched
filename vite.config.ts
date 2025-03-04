import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import { execSync } from 'child_process'


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const commitDate = execSync('git log -1 --format=%cI').toString().replace(/^\s+|\s+$/g, '').trimEnd()
  const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().replace(/^\s+|\s+$/g, '').trimEnd()
  const tagName = execSync('git describe --tags --always --dirty').toString('utf8').replace(/^\s+|\s+$/g, '').trimEnd()

  process.env.VITE_GIT_COMMIT_DATE = commitDate;
  process.env.VITE_GIT_BRANCH_NAME = branchName;
  process.env.VITE_TAG_NAME = tagName

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
