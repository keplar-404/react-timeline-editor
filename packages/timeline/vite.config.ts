import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  // Plugin list
  plugins: [
    react(), 
    // Use dts plugin to generate TypeScript declaration files
    dts({ 
      include: ['src/**/*'], 
      outDir: 'dist', 
      insertTypesEntry: true, 
      compilerOptions: { 
        declaration: true, 
        emitDeclarationOnly: true 
      } 
    })
  ],
  // Path alias
  resolve: {
  },
  // Build config
  build: {
    // Library mode config
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'react-timeline-editor',
      formats: ['es', 'umd', 'cjs'],
      fileName: (format) => `index.${format}.js`,
    },
    // Rollup build options
    rollupOptions: {
      // Externalize dependencies that should not be bundled
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        // Provide global variables for externalized dependencies in UMD build
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJsxRuntime',
        },
      },
    },
  },
});
