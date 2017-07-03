import settings from '@/lib/settings'

describe('settings.js', () => {
  it('settings are loaded', () => {
    assert.typeOf(settings, 'object')
  })
})
