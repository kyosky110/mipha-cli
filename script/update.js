const { log, getVersionForFetch } = require('../utils')
const inquirer = require('inquirer')
const install = require('./install')
/**
 * 检查版本
 */
module.exports = async function (params) { 
  const packageName = params.packageName
  const packageVersion = params.packageVersion
  const listVersion = getVersionForFetch(packageName)
  if (listVersion.trim() !== packageVersion) {
    log(`当前版本为 ${packageVersion}`)
    log(`cli 版本过旧，建议执行 npm i -g ${packageName}@latest 升级 cli： ${packageVersion} -> ${listVersion} `)
    const { needUpdate } = await inquirer.prompt({
      message: '有最新模板是否更新：',
      type: 'list',
      name: 'needUpdate',
      choices: ['是', '否']
    })
    if (needUpdate === '是') {
      console.log('更新cli')
      await install({ packageName: packageName, templatePath: params.templatePath})
    }
  } else {
    log(`当前版本为最新版本 ${packageVersion}`)
  }
}