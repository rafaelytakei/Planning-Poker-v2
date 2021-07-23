import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import ViteComponents, { PrimeVueResolver } from 'vite-plugin-components'
import VitePluginFonts from 'vite-plugin-fonts'
import * as path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
    Pages(),
    Layouts(),
    ViteComponents({
      customComponentResolvers: [
        PrimeVueResolver({ importTheme: 'vela-green' }),
      ],
      directoryAsNamespace: true,
    }),
    VitePluginFonts({
      google: {
        preconnect: true,
        families: [
          {
            name: 'Noto Sans',
            styles: 'wght@400;700',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve('/src') },
      { find: '~', replacement: path.resolve('/src') },
    ],
  },
})
