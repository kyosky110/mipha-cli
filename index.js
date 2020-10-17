const minimist = require('minimist')
const fs = require('fs')
const homeDir = require('osenv').home() // 跨平台
const mkdirp = require('mkdirp') // 跨平台
const path = require('path')
const templatePath = path.resolve(homeDir, '.mipha') // 模板地址

const { log, getVersionForFetch } = require('./utils')
// const args = minimist(process.argv.slice(2))

const package = require('./package.json')

/**
 * 检查cli版本号
 */
function checkCliVersion() {
  const packageName = package.name
  const packageVersion = package.version
  const listVersion = getVersionForFetch(packageName)
  if (listVersion.trim() !== packageVersion) {
    log(`当前版本为 ${packageVersion}`)
    log(`cli 版本过旧，建议执行 npm i -g ${packageName}@latest 升级 cli： ${packageVersion} -> ${listVersion} `)
  }
}

/**
 * 检查模板路径
 */
function checkTemplatePath() {
  mkdirp.sync(templatePath)
  const package = path.resolve(templatePath, 'package.json')
  if (!fs.existsSync(package)) {
    fs.writeFileSync(package, JSON.stringify({ name: '_', description: '_',
      repository:'_', license: 'MIT'}))
  }
}

// checkCliVersion()
const program = require('commander')
program
  .version(`mipha/cli ${require('./package').version}`)
  .usage('<command> [options]')

program
  .command('create <app-name>')
  .description('create a new project powered by vue-cli-service')
  .option('-p, --preset <presetName>', 'Skip prompts and use saved or remote preset')
  .action((name, cmd) => {
    console.log('action')
    console.log(name)
    console.log(cleanArgs(cmd))
  })

program
  .command('init [template]')
  .description('初始化一个模板')
  .alias('use')
  .action(template => {
    checkTemplatePath()
    require('./script/init')({ packageName: template, templatePath })
  })

program
  .command('install <template>')
  .description('安装一个模板')
  .alias('i')
  .action(template => {
    checkTemplatePath()
    require('./script/install')({ packageName: template, templatePath })
  })

program
  .command('uninstall <template>')
  .description('删除一个模板')
  .alias('d')
  .action(template => {
    checkTemplatePath()
    require('./script/uninstall')({ packageName: template, templatePath })
  })

program
  .command('ls')
  .description('查看当前安装的模板')
  .action(() => {
    checkTemplatePath()
    require('./script/ls')(templatePath)
  })

program
  .command('update')
  .description('检查更新cli')
  .action(() => {
    require('./script/update')({ packageName: package.name, packageVersion: package.version, templatePath})
  })

// TODO 取消构建功能，暂时没有需要用到的情况
// program
//   .command('build')
//   .description('构建项目')
//   .action(() => {
//     require('./script/build')()
//   })

// program
//   .command('dev')
//   .description('进入开发环境')
//   .action(() => {
//     require('./script/dev')()
//   })
program.parse(process.argv)


function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs(cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}