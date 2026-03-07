import { pluginPreview } from './plugins/plugin-preview';
import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  globalStyles: path.join(__dirname, 'styles/index.css'),
  title: 'React Timeline Editor',
  icon: '/icon.png',
  logoText: 'React Timeline Editor',
  lang: 'en',
  ssg: false,
  logo: {
    light: '/icon.png',
    dark: '/icon.png',
  },
  markdown: {
    showLineNumbers: true,
    defaultWrapCode: true,
  },
  locales: [
    {
      lang: 'en',
      // Nav bar language toggle label
      label: 'English',
      title: 'Rspress',
      description: 'Static Site Generator',
    },
  ],
  themeConfig: {
    locales: [
      {
        lang: 'en',
        label: 'English',
        searchPlaceholderText: 'Search Docs',
      },
    ],
    darkMode: false,
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/keplar-404/react-timeline-editor',
      },
    ],
  },
  plugins: [
    pluginPreview({
      iframeOptions: {
        builderConfig: {
          resolve: {
            alias: {
              '@keplar-404/react-timeline-editor': path.join(__dirname, '../timeline/src/index.tsx'),
              '@src': path.join(__dirname, 'src'),
              '@theme': path.join(__dirname, 'plugins/plugin-preview/static/dummy.js'),
              '@rspress/theme-default': path.join(__dirname, 'plugins/plugin-preview/static/dummy.js'),
              '@theme-assets': path.join(__dirname, 'plugins/plugin-preview/static/dummy.js'),
              'virtual-search-hooks': path.join(__dirname, 'plugins/plugin-preview/static/dummy.js'),
              'virtual-global-styles': path.join(__dirname, 'plugins/plugin-preview/static/dummy.css'),
              'rspress/runtime': path.join(__dirname, 'node_modules/@rspress/core/dist/runtime/index.js'),
              '@rspress/core/runtime': path.join(__dirname, 'node_modules/@rspress/core/dist/runtime/index.js'),
            },
          },
        },
      },
      previewLanguages: ['jsx', 'tsx', 'css', 'less', 'ts'],
    }),
  ],
  builderConfig: {
    server: {
      middlewareMode: false,
    },
    resolve: {
      alias: {
        '@keplar-404/react-timeline-editor': path.join(__dirname, '../timeline/src/index.tsx'),
        '@src': path.join(__dirname, 'src'),
      },
    },
  },
});
