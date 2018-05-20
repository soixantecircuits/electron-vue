import electron from 'electron'
import { Application } from 'spectron'

export default {
  afterEach () {
    this.timeout(10000)

    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  },
  beforeEach () {
    this.timeout(10000)
    this.app = new Application({
      path: electron,
      {{#isEnabled plugins 'standard-settings'}}
      args: ['dist/electron/main.js', '--window.kiosk', 'false', '--window.width', '800'],
      {{else}}
      args: ['dist/electron/main.js'],
      {{/isEnabled}}
      startTimeout: 10000,
      waitTimeout: 10000
    })

    return this.app.start()
  }
}
