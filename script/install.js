const { log, getPackageName } = require('../utils')
const execSync = require('child_process').execSync

module.exports = async function (params) { 
  const packageName = getPackageName(params.packageName)
  // const packageName = params.packageName
  log(`正在安装最新版的 ${packageName} ...`)
  try {
    execSync(`npm i ${packageName}@latest -S --registry=https://registry.npm.taobao.org`, 
      { cwd: params.templatePath })
    log(`安装成功`, 'green')
  } catch (e) {
    log(`安装失败，请检查包名称是否正确 ${packageName}`, 'red')
  }
}