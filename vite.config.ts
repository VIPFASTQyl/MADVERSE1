import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import Sitemap from "vite-plugin-sitemap";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    Sitemap({
      hostname: "https://www.madverse-ks.page",
      dynamicRoutes: [
        "/",
        "/about",
        "/contact",
        "/activity/youth",
        "/activity/arts",
        "/activity/culture",
        "/activity/sports",
        "/activity/exhibition",
        "/activity/volunteering",
      ],
      robots: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/admin", "/profile"],
          sitemap: "https://www.madverse-ks.page/sitemap.xml",
        },
      ],
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation': ['framer-motion'],
          'query': ['@tanstack/react-query'],
          'supabase': ['@supabase/supabase-js'],
        },
      },
    },
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
      },
    },
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    sourcemap: mode === 'development',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@radix-ui/react-dialog', 'framer-motion'],
  },
}));

