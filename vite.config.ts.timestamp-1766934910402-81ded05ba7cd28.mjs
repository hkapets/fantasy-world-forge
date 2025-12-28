// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///home/project/node_modules/lovable-tagger/dist/index.js";
import UnoCSS from "file:///home/project/node_modules/unocss/dist/vite.mjs";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    UnoCSS(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    copyPublicDir: true,
    target: "esnext",
    minify: "esbuild",
    esbuild: {
      drop: ["console", "debugger"]
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("three")) {
              return "three";
            }
            if (id.includes("recharts")) {
              return "recharts";
            }
            if (id.includes("html2canvas") || id.includes("jspdf")) {
              return "export-libs";
            }
            if (id.includes("radix-ui")) {
              return "radix-ui";
            }
            if (id.includes("react-router")) {
              return "react-router";
            }
            if (id.includes("dexie")) {
              return "dexie";
            }
            if (id.includes("lucide-react")) {
              return "lucide";
            }
            if (id.includes("date-fns")) {
              return "date-utils";
            }
            if (id.includes("react")) {
              return "react";
            }
            return "vendor";
          }
          if (id.includes("/src/components/")) {
            if (id.includes("/Characters/") || id.includes("/Lore/") || id.includes("/Maps/") || id.includes("/Chronology/")) {
              return "features";
            }
            if (id.includes("/Relationships/") || id.includes("/Scenarios/") || id.includes("/Notes/")) {
              return "features-secondary";
            }
            if (id.includes("/Modal/")) {
              return "modals";
            }
            return "components";
          }
          if (id.includes("/src/hooks/")) {
            return "hooks";
          }
          if (id.includes("/src/lib/")) {
            return "utils";
          }
        },
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/chunk-[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]"
      }
    },
    chunkSizeWarningLimit: 600
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCI6OlwiLFxuICAgIHBvcnQ6IDgwODAsXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIFVub0NTUygpLFxuICAgIG1vZGUgPT09ICdkZXZlbG9wbWVudCcgJiZcbiAgICBjb21wb25lbnRUYWdnZXIoKSxcbiAgXS5maWx0ZXIoQm9vbGVhbiksXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBjb3B5UHVibGljRGlyOiB0cnVlLFxuICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgbWluaWZ5OiAnZXNidWlsZCcsXG4gICAgZXNidWlsZDoge1xuICAgICAgZHJvcDogWydjb25zb2xlJywgJ2RlYnVnZ2VyJ10sXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzKGlkKSB7XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCd0aHJlZScpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAndGhyZWUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdyZWNoYXJ0cycpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAncmVjaGFydHMnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdodG1sMmNhbnZhcycpIHx8IGlkLmluY2x1ZGVzKCdqc3BkZicpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnZXhwb3J0LWxpYnMnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdyYWRpeC11aScpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAncmFkaXgtdWknO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdyZWFjdC1yb3V0ZXInKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ3JlYWN0LXJvdXRlcic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ2RleGllJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdkZXhpZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ2x1Y2lkZS1yZWFjdCcpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnbHVjaWRlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnZGF0ZS1mbnMnKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ2RhdGUtdXRpbHMnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdyZWFjdCcpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAncmVhY3QnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3InO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9zcmMvY29tcG9uZW50cy8nKSkge1xuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCcvQ2hhcmFjdGVycy8nKSB8fCBpZC5pbmNsdWRlcygnL0xvcmUvJykgfHwgaWQuaW5jbHVkZXMoJy9NYXBzLycpIHx8IGlkLmluY2x1ZGVzKCcvQ2hyb25vbG9neS8nKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ2ZlYXR1cmVzJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnL1JlbGF0aW9uc2hpcHMvJykgfHwgaWQuaW5jbHVkZXMoJy9TY2VuYXJpb3MvJykgfHwgaWQuaW5jbHVkZXMoJy9Ob3Rlcy8nKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ2ZlYXR1cmVzLXNlY29uZGFyeSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9Nb2RhbC8nKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ21vZGFscyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gJ2NvbXBvbmVudHMnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9zcmMvaG9va3MvJykpIHtcbiAgICAgICAgICAgIHJldHVybiAnaG9va3MnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9zcmMvbGliLycpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3V0aWxzJztcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9jaHVuay1bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXVtleHRuYW1lXScsXG4gICAgICB9LFxuICAgIH0sXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA2MDAsXG4gIH0sXG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFDaEMsT0FBTyxZQUFZO0FBSm5CLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUNQLFNBQVMsaUJBQ1QsZ0JBQWdCO0FBQUEsRUFDbEIsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUNoQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsSUFDZixRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsSUFDUixTQUFTO0FBQUEsTUFDUCxNQUFNLENBQUMsV0FBVyxVQUFVO0FBQUEsSUFDOUI7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGFBQWEsSUFBSTtBQUNmLGNBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUMvQixnQkFBSSxHQUFHLFNBQVMsT0FBTyxHQUFHO0FBQ3hCLHFCQUFPO0FBQUEsWUFDVDtBQUNBLGdCQUFJLEdBQUcsU0FBUyxVQUFVLEdBQUc7QUFDM0IscUJBQU87QUFBQSxZQUNUO0FBQ0EsZ0JBQUksR0FBRyxTQUFTLGFBQWEsS0FBSyxHQUFHLFNBQVMsT0FBTyxHQUFHO0FBQ3RELHFCQUFPO0FBQUEsWUFDVDtBQUNBLGdCQUFJLEdBQUcsU0FBUyxVQUFVLEdBQUc7QUFDM0IscUJBQU87QUFBQSxZQUNUO0FBQ0EsZ0JBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUMvQixxQkFBTztBQUFBLFlBQ1Q7QUFDQSxnQkFBSSxHQUFHLFNBQVMsT0FBTyxHQUFHO0FBQ3hCLHFCQUFPO0FBQUEsWUFDVDtBQUNBLGdCQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0IscUJBQU87QUFBQSxZQUNUO0FBQ0EsZ0JBQUksR0FBRyxTQUFTLFVBQVUsR0FBRztBQUMzQixxQkFBTztBQUFBLFlBQ1Q7QUFDQSxnQkFBSSxHQUFHLFNBQVMsT0FBTyxHQUFHO0FBQ3hCLHFCQUFPO0FBQUEsWUFDVDtBQUNBLG1CQUFPO0FBQUEsVUFDVDtBQUNBLGNBQUksR0FBRyxTQUFTLGtCQUFrQixHQUFHO0FBQ25DLGdCQUFJLEdBQUcsU0FBUyxjQUFjLEtBQUssR0FBRyxTQUFTLFFBQVEsS0FBSyxHQUFHLFNBQVMsUUFBUSxLQUFLLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDaEgscUJBQU87QUFBQSxZQUNUO0FBQ0EsZ0JBQUksR0FBRyxTQUFTLGlCQUFpQixLQUFLLEdBQUcsU0FBUyxhQUFhLEtBQUssR0FBRyxTQUFTLFNBQVMsR0FBRztBQUMxRixxQkFBTztBQUFBLFlBQ1Q7QUFDQSxnQkFBSSxHQUFHLFNBQVMsU0FBUyxHQUFHO0FBQzFCLHFCQUFPO0FBQUEsWUFDVDtBQUNBLG1CQUFPO0FBQUEsVUFDVDtBQUNBLGNBQUksR0FBRyxTQUFTLGFBQWEsR0FBRztBQUM5QixtQkFBTztBQUFBLFVBQ1Q7QUFDQSxjQUFJLEdBQUcsU0FBUyxXQUFXLEdBQUc7QUFDNUIsbUJBQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLFFBQ0EsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsSUFDQSx1QkFBdUI7QUFBQSxFQUN6QjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
