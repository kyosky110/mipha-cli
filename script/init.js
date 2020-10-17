const { log, getInstalledStatus, getInstalledTemplates } = require('../utils')
const inquirer = require('inquirer')
const yoemanEnv = require('yeoman-environment').createEnv()
const install = require('./install')
const resolveFrom = require('resolve-from').silent

module.exports = async function (params) { 
  console.log('init ' + params.packageName)
  const templates = getInstalledTemplates(params.templatePath)
  if (!Object.keys(templates).length) {
    log(`您还没有安装任何模板，请先执行 install 命令安装`)
  }
  const { template: packageName } = await inquirer.prompt({
    message: '请选择一个模板：',
    type: 'list',
    name: 'template',
    choices: Object.keys(templates)
  })
  console.log(packageName)
  const status = getInstalledStatus(packageName, params.templatePath)
  if (status !== 2) {
    const { needUpdate } = await inquirer.prompt({
      message: '有最新模板是否更新：',
      type: 'list',
      name: 'needUpdate',
      choices: ['是', '否']
    })
    if (needUpdate === '是') {
      console.log('更新模板')
      // TODO 增加模板更新
      await install({ packageName: packageName, templatePath: params.templatePath})
    }
  }
  yoemanEnv.register(resolveFrom(params.templatePath, packageName), packageName)
  yoemanEnv.run(packageName, (error, d) => {
    d && log('happy coding', 'green')
  })
}