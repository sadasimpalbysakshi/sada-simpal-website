import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
// import { componentTagger } from "lovable-tagger";

// // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => ({
//   server: {
//     host: "::",
//     port: 8080,
//   },
//   plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// }));




export default defineConfig({
  base: process.env.VITE_BASE ?? "/",
  plugins: [
    react(),
    {
      // The old GitHub-Pages "404.html" trick breaks single-page routing on
      // Cloudflare Pages / Netlify, so never ship it.
      name: "drop-legacy-404",
      closeBundle() {
        const f = path.resolve(__dirname, "dist/404.html");
        if (fs.existsSync(f)) fs.rmSync(f);
      },
    },
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion"],
          supabase: ["@supabase/supabase-js"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})