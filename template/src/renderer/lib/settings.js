'use strict'

let settings = {}

// Try to load electron remote
if (process.env.IS_WEB || process.env.NODE_ENV === 'testing') {
  /* eslint-disable */
  settings = SETTINGS
  /* eslint-enable */
} else {
  var remote = require('electron').remote
  settings = remote.getGlobal('settings')
}

if (process.env.debug) {
  console.log('loaded settings: ', settings)
}

module.exports = settings
