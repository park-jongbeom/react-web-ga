import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const cspDevStyleInlinePlugin = (isDev: boolean): Plugin => ({
  name: 'csp-dev-style-inline',
  transformIndexHtml(html) {
    if (!isDev) return html
    // 개발 환경에서만 HMR/CSS 주입을 허용하기 위해 inline style을 풀어준다.
    return html.replace(
      /style-src\s+'self';/g,
      "style-src 'self' 'unsafe-inline';"
    )
  },
})

export default defineConfig(({ mode }) => ({
  plugins: [react(), cspDevStyleInlinePlugin(mode === 'development')],
  server: {
    proxy: {
      '/api/auth': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth/, '/api/auth'),
      },
      '/api/user': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/user/, '/api/user'),
      },
      '/api/audit': {
        target: 'http://localhost:8083',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/audit/, '/api/audit'),
      },
    },
  },
  build: {
    // 빌드 최적화: 인라인 스크립트 제거
    rollupOptions: {
      output: {
        // 인라인 스크립트를 별도 파일로 분리
        inlineDynamicImports: false,
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    globals: true,
  },
}))
