// 之后可能删除
const { log, getConfigs, getBuilderFn } = require('../utils')
module.exports = async function () { 
  const buildFn = getBuilderFn()
  const { webpackCustom = {} } = getConfigs()
  log('开始build')
  buildFn({ env: 'production' }, webpackCustom)
}