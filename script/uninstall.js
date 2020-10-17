const { log } = require('../utils')
const execSync = require('child_process').execSync

module.exports = async function (params) { 
  const packageName = params.packageName
  log(`正在删除 ${packageName} ...`)
  try {
    execSync(`npm uninstall ${packageName}`, 
      { cwd: params.templatePath })
    log(`删除成功`, 'green')
  } catch (e) {
    log(`删除失败，请检查包名称是否正确 ${packageName}`, 'red')
  }
}