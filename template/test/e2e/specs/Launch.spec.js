import utils from '../utils'

describe('Launch', function () {
  beforeEach(utils.beforeEach)
  afterEach(utils.afterEach)

  {{#isEnabled plugins 'vue-spacebro-client'}}
  it('gets message from spacebro', function () {
    return this.app.client.waitUntilTextExists('#message', 'thank you', 10000)
    .then(this.app.client.getText('#message').then(function (text) {
      expect(text).to.equal('thank you')
    }))
  })
  {{/isEnabled}}
  it('shows the proper application title', function () {
    return this.app.client.getTitle()
      .then(title => {
        expect(title).to.equal('{{ name }}')
      })
  })
  {{#isEnabled plugins 'standard-settings'}}
  it('open window of width from commandLine arg', function () {
    return this.app.browserWindow.getBounds()
      .then(bounds => {
        expect(bounds.width).to.equal(800)
      })
  })
  {{/isEnabled}}
})
