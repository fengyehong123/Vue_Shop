// 项目发布阶段需要用到的babel插件
const prodPlugins = []
/*
  process.env.NODE_ENV 获取当前项目的模式
*/
if(process.env.NODE_ENV === 'production') {
  // 如果当前项目是产品模式就把移除console打印插件添加到数组中
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  'presets': [
    '@vue/app'
  ],
  'plugins': [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ],
    // 发布产品时候的插件数组
    // ...代表解构数组
    ...prodPlugins
  ]
}
