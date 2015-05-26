#!/usr/bin/env node
var join = require('path').join

module.exports = {
  reporter: function (results, data, opts) {
    var len = results.length
      , str = ''
      , prevfile

    opts = opts || {}

    results.forEach(function (result) {
      var file = result.file
        , error = result.error

      if (prevfile && prevfile !== file) {
        str += '\n'
      }

      prevfile = file

      str += join(process.cwd(), file)  + ':' + error.line + ':' +
        error.character + '\n\t' + error.reason

      if (opts.verbose) {
        str += ' (' + error.code + ')'
      }

      str += '\n\n'
    })

    if (str) {
      process.stdout
        .write(str + '\n' + len + ' error' + ((len === 1) ? '' : 's') + '\n')
    }
  }
}