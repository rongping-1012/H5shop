export default {
  plugins: {
    'postcss-px-to-viewport-8-plugin': {
      viewportWidth: 375, // 设计稿宽度
      unitPrecision: 5,   // 转换后的精度
      viewportUnit: 'vw', // 转换成的视窗单位
      selectorBlackList: ['.ignore', '.hairlines'], // 不转换的类名
      minPixelValue: 1,   // 小于或等于`1px`不转换为视窗单位
      mediaQuery: false,  // 允许在媒体查询中转换`px`
      exclude: [/node_modules/] // 排除node_modules中的文件
    }
  }
}
