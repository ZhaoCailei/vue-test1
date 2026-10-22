const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  // 使用相对路径，保证 dist/index.html 双击（file://）也能正确加载 js/css
  publicPath: './',
  outputDir: 'dist',
  productionSourceMap: false,
  lintOnSave: false,
  devServer: {
    port: 8080,
    open: true
  }
})
