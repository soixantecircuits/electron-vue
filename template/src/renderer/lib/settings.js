'use strict'

let settings = {}

// Try to load electron remote
if (process.env.IS_WEB || process.env.NODE_ENV === 'testing') {
  /* eslint-disable */
  settings = SETTINGS
  /* eslint-enable */
} else {
  /* eslint-disable */
  var remote = require('electron').remote
  /* eslint-enable */
  settings = remote.getGlobal('settings')
}

if (process.env.debug) {
  /* eslint-disable */
  console.log('loaded settings: ', settings)
  /* eslint-enable */
}

module.exports = settings
