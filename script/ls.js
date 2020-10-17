const { log, getInstalledTemplates } = require('../utils')
/**
 * 查看当前安装的模板
 */
module.exports = async function (templatePath) { 
  const templates = getInstalledTemplates(templatePath)
  if (!Object.keys(templates).length) {
    log(`您还没有安装任何模板`)
    return
  }
  const tempKeys = Object.keys(templates)
  tempKeys.forEach(temp => {
    log(`${temp}@${templates[temp]}`)
  });
}