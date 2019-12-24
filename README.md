# source-replace-plugins
一个文件代码替换webpack插件。

插件功能：将原文件中设置的特殊字符串，替换成对应文件的代码；

## usage

```javascript
// webpackConfig/webpack.config.js
plugins: [
  new SourceReplace({
    basePath: path.join(__dirname, '..'),
    sourcePath: path.join(__dirname, '../src/run.js'),
    targetPath: path.join(__dirname, '../dist/js/run.bundle.js'),
    replaceMode: 'js'
  })
]
```

* basePath：必填；项目根路径，在**sourcePath**的文件中，所有匹配到的字符串的文件路径都是以这个为基准的，可参考下面的demo。
* sourcePath：必填；需要替换的文件路径；
* targetPath：必填；替换后输出的文件路径；
* replaceMode：选填；默认为**js**；插件中预设的替换模式，暂时只有**js**模式；
* templateReg：选填；字符串匹配正则；匹配**sourcePath**文件中需要替换的字符串；如果replaceMode设置了**js**，则templateReg默认会被配置成**/\\@\\{\\{\\{(\[^\\}\]+)\\}\\}\\}/gi**。
* replaceFunc：选填；替换处理函数；可以将读入的文件进行自定义处理之后再写入；如果replaceMode设置了**js**，则replaceFunc默认会被设置成如下函数：

```javascript
replaceFunc = function (bundleFileCode, targetStr) {
  let code = ''
  code = bundleFileCode.replace(/\\/gi, '\\\\')
  code = code.replace(/"/gi, '\\"')
  return code
}
```

其中 **bundleFileCode** 为字符串匹配到的文件的代码，**targetStr** 为匹配到的文锦啊的字符串。

## Demo

将**run.js**文件中的***@{{{dist/js/run.bundle.js}}}***字符串，替换成**dist/js/run.bundle.js**文件的所有代码；

```javascript
// run.js
function createScriptDom (content) {
  var dom = document.createElement('script')
  dom.setAttribute('type', 'text/javascript')
  dom.innerText = scriptContent
  document.head.appendChild(dom)
}
createScriptDom("@{{{./dist/js/run.bundle.js}}}")
```

```javascript
// webpackConfig/webpack.config.js
module.exports = {
  ...
  plugins: [
    new SourceReplace({
      basePath: path.join(__dirname, '..'),
      sourcePath: path.join(__dirname, '../src/run.js'),
      targetPath: path.join(__dirname, '../dist/js/run.bundle.js'),
      replaceMode: 'js'
    })
  ]
}
```

