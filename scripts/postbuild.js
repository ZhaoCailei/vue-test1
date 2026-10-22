/**
 * 构建后处理：
 * Chromium 内核浏览器直接双击打开 file:// 页面时，会以 CORS 策略拦截本地字体文件，
 * 导致 Element UI 的图标字体（element-icons）加载失败。这里把 dist/css 中引用的
 * 字体文件转成 base64 内联进 CSS，这样 dist/index.html 双击即可正常显示所有图标。
 */
const fs = require('fs')
const path = require('path')

const distDir = path.resolve(__dirname, '..', 'dist')
const cssDir = path.join(distDir, 'css')

const MIME = {
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.svg': 'image/svg+xml'
}

let inlined = 0

if (fs.existsSync(cssDir)) {
  const cssFiles = fs.readdirSync(cssDir).filter((file) => file.endsWith('.css'))

  cssFiles.forEach((file) => {
    const cssPath = path.join(cssDir, file)
    const original = fs.readFileSync(cssPath, 'utf8')

    const output = original.replace(/url\(([^)]+)\)/g, (match, rawUrl) => {
      const cleaned = rawUrl.trim().replace(/^['"]|['"]$/g, '')
      if (/^(data:|https?:|\/\/)/i.test(cleaned)) return match

      const withoutQuery = cleaned.split('#')[0].split('?')[0]
      const fontPath = path.resolve(path.dirname(cssPath), withoutQuery)

      if (!fs.existsSync(fontPath)) return match

      const ext = path.extname(fontPath).toLowerCase()
      if (!MIME[ext]) return match

      const base64 = fs.readFileSync(fontPath).toString('base64')
      inlined += 1
      return `url(data:${MIME[ext]};base64,${base64})`
    })

    if (output !== original) {
      fs.writeFileSync(cssPath, output)
    }
  })
}

if (inlined > 0) {
  console.log(`[postbuild] 已内联 ${inlined} 个字体资源，dist/index.html 可直接双击打开。`)
} else {
  console.log('[postbuild] 未发现需要内联的字体资源。')
}
