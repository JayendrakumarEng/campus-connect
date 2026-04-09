import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const getBasePath = () => {
  const overrideBase = process.env.VITE_BASE_URL;

  if (overrideBase) {
    return overrideBase;
  }

  if (process.env.GITHUB_ACTIONS === "true") {
    const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];

    if (!repoName || repoName.endsWith(".github.io")) {
      return "/";
    }

    return `/${repoName}/`;
  }

  return "/";
};

export default defineConfig(() => ({
  base: getBasePath(),
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));