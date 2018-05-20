const path = require('path')
const gitInfo = require('git-info-sync')

/**
 * `electron-packager` options
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-packager.html
 */
module.exports = {
  arch: 'x64',
  {{#isEnabled plugins 'standard-settings'}}
  asar: {
    unpackDir: 'settings'
  },
  {{else}}
  asar: true,
  {{/isEnabled}}
  buildVersion: gitInfo(['SHA']).SHA,
  dir: path.join(__dirname, '../'),
  icon: path.join(__dirname, '../build/icons/icon'),
  ignore: /(^\/(src|test|\.[a-z]+|README|yarn|static|dist\/web))|\.gitkeep/,
  out: path.join(__dirname, '../build'),
  overwrite: true,
  platform: process.env.BUILD_TARGET || 'all'
}
