const fs = require('fs')
const path = require('path')
const requireFrom = require('import-from').silent
const execSync = require('child_process').execSync
const chalk = require('chalk')
const { MIPHA_NAME } = require('../constant')
/**
 * 统一的日志输出
 * @param {*} message 
 * @param {*} color 
 */
function log(message, color = 'yellow') {
  const fn = chalk[color] || chalk.yellow
  console.log(fn(message))
}

/**
 * 获取npm上的版本号
 * @param {*} packageName 
 */
function getVersionForFetch(packageName) {
  // 返回 buffer 转 string
  const version = execSync(`npm view ${packageName} version --registry=https://registry.npm.taobao.org`) + ''
  return version.trim()
}

/**
 * 获取路径下已经安装的包
 * @param {*} targetDir 
 */
function getInstalledPkgs(targetDir) {
  const pkgFile = path.resolve(targetDir, 'package.json')
  if (!fs.existsSync(pkgFile)) return {}
  const pkgJson = require(pkgFile)
  return pkgJson.dependencies || {}
}

/**
 * 获取包的安装状态
 * 0 未安装 1 安装但不是最新 2 最新
 * @param {*} packageName 
 * @param {*} targetDir 
 */
function getInstalledStatus(packageName, targetDir) {
  const dependencies = getInstalledPkgs(targetDir)
  if (!dependencies[packageName]) return 0
  const lastVersion = getVersionForFetch(packageName)
  const currentVersion = requireFrom(targetDir,
     path.join(packageName, 'package.json')).version
  if (currentVersion === lastVersion) {
    return 2
  }
  return 1
}

/**
 * 获取路径下的模板包
 * @param {*} targetDir 
 */
function getInstalledTemplates(targetDir) {
  const dependencies = getInstalledPkgs(targetDir)
  // Object.keys(dependencies).forEach(item => {
  //   if (!item.match(/^mipha-/)) {
  //     delete dependencies[item]
  //   }
  // })
  return dependencies
}

/**
 * 获取自定义构建的配置文件
 */
function getConfigs() {
  const configs = requireFrom(process.cwd(), './maoda.js')
  if (!configs || !configs.builder) {
    log('请确保工程根路径下有 maoda.js 文件，且文件中配置了 builder 属性', 'red')
    process.exit(1)
  }
  return configs
}

/**
 * 获取build，如果没安装则安装
 */
function getBuilderFn() {
  const { builder } = getConfigs()
  const status = getInstalledStatus(builder, process.cwd())
  switch (status) {
    case 0:
      log(`检测到工程并未添加${builder}，将自动为您安装最新版`, 'red')
      log(`安装${builder}中...`)
      execSync(
        `npm i ${builder}@latest -S --registry=https://registry.npm.taobao.org`,
        { cwd: process.cwd() }
      )
      break
    case 1:
      log(`检测到您的${builder}并非最新版，推荐在工程下 npm i ${builder}@latest -S 进行更新`)
      break
    default:
      break
  }
  return requireFrom(process.cwd(), builder)
}

module.exports = {
  getInstalledPkgs,
  log,
  getVersionForFetch,
  getInstalledStatus,
  getInstalledTemplates,
  getConfigs,
  getBuilderFn
}