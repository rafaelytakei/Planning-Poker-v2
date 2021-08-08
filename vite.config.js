import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import ViteComponents, { PrimeVueResolver } from 'vite-plugin-components'
import VitePluginFonts from 'vite-plugin-fonts'
import * as path from 'path'
// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname)
  Object.assign(process.env, env)
  return {
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
    server: {
      fs: {
        strict: true,
      },
    },
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve('/src') },
        { find: '~', replacement: path.resolve('/src') },
      ],
    },
  }
})
