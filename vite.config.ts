import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/minigame-on-react/",
  build: {
    outDir: "docs",
  },
  server: {
    host: "0.0.0.0",
  },
});
