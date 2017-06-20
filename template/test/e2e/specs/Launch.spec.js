import utils from '../utils'

describe('Launch', function () {
  beforeEach(utils.beforeEach)
  afterEach(utils.afterEach)

  it('shows the proper application title', function () {
    return this.app.client.getTitle()
      .then(title => {
        expect(title).to.equal('{{ name }}')
      })
  })
  {{#if settings}}
  it('open window of width from commandLine arg', function () {
    return this.app.browserWindow.getBounds()
      .then(bounds => {
        expect(bounds.width).to.equal(800)
      })
  })
  {{/if}}
})
