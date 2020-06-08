const path = require('path')
const fs = require('fs')
const util = require('util')
const readAsync = util.promisify(fs.readFile)

class SourceReplace {
  constructor (options) {
    let msg = this.checkOptions(options)
    if (msg) { throw new Error(msg) }
    this.options = options
  }
  checkOptions (options) {
    if (!options.sourcePath) { return 'Please set sourcePath!' }
    if (!options.replaceMode && !options.templateReg && !options.replaceFunc) {
      options.replaceMode = 'js'
    }
    if (options.replaceMode === 'js') {
      options.templateReg = /\@\{\{\{([^\}]+)\}\}\}/gi
      options.replaceFunc = function (bundleFileCode, targetStr) {
        let code = bundleFileCode
        // 去除多行注释
        code = code.replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/mg, '')
        code = code.replace(/\\/gi, '\\\\')
        code = code.replace(/"/gi, '\\"')
        return code
      }
    }
    if (!options.basePath) { options.basePath = path.join(__dirname) }
  }
  apply (compiler) {
    let that = this
    compiler.hooks.done.tap('source replace plugin', async function () {
      let injectFilePath = that.options.sourcePath
      let injectFileCode = await readAsync(injectFilePath, { encoding: 'utf8' })
      let tmpFileCode = injectFileCode // 缓存文件源码副本
      let reg = that.options.templateReg
      let regResult = reg.exec(injectFileCode)
      // 循环匹配，并替换对应的文件
      while (regResult && regResult.length >= 2) { // 如果有匹配到对应的字符串
        let filePath = path.join(that.options.basePath, regResult[1])
        let bundleFileCode = await readAsync(filePath, { encoding: 'utf8' })
        bundleFileCode = that.options.replaceFunc(bundleFileCode, regResult[0])
        tmpFileCode = tmpFileCode.replace(regResult[0], bundleFileCode)
        regResult = reg.exec(injectFileCode) // 继续匹配
      }
      await util.promisify(fs.writeFile)(that.options.targetPath, tmpFileCode)
      console.log('successfully replaced！')
    })
  }
}

module.exports = SourceReplace
