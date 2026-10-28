import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        name: 'Hello Notes',
        short_name: 'Notes',
        description: 'A simple offline-first notes application.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          {
            "src": "pwa-64x64.png",
            "sizes": "64x64",
            "type": "image/png"
          },
          {
            "src": "pwa-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "pwa-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          },
          {
            "src": "maskable-icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ],
        screenshots: [
          {
            "src": "/screenshots/desktop-wide.png",
            "sizes": "1280x720",
            "type": "image/png",
            "form_factor": "wide",
            "label": "Desktop View"
          },
          {
            "src": "/screenshots/mobile-narrow.png",
            "sizes": "750x1334",
            "type": "image/png",
            "form_factor": "narrow",
            "label": "Mobile App View"
          }
        ]
      }
    })
  ],
})
