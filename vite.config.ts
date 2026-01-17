import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic"
    }),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
      outDir: "dist",
      entryRoot: "src",
    }),
    libInjectCss()
  ],

  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "React Blueprint",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`
    },

    cssCodeSplit: false,

    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react-router-dom",
        "react/jsx-runtime",  
        "react/jsx-dev-runtime", 
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-router-dom": "ReactRouterDOM"
        },
        assetFileNames: "style.css"
      }
    },

    minify: "terser"
  },

});
