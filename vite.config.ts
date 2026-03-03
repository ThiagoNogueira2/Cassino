import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL || "http://localhost:8000/api"),
    "import.meta.env.VITE_REVERB_HOST": JSON.stringify(process.env.VITE_REVERB_HOST || "localhost"),
    "import.meta.env.VITE_REVERB_PORT": JSON.stringify(process.env.VITE_REVERB_PORT || "6003"),
    "import.meta.env.VITE_PUSHER_APP_KEY": JSON.stringify(process.env.VITE_PUSHER_APP_KEY || "crash-game-key"),
  },
}));
