import Vue from 'vue'
import Vuex from 'vuex'

{{#isEnabled plugins 'vuex-electron'}}
import { createPersistedState, createSharedMutations } from 'vuex-electron'

{{/isEnabled}}
import modules from './modules'

Vue.use(Vuex)
{{#isEnabled plugins 'vuex-electron'}}
var vuexPlugins
if (!process.env.IS_WEB)) {
  vuexPlugins = [createPersistedState(), createSharedMutations()]
}
{{/isEnabled}}

export default new Vuex.Store({
  modules,
  {{#isEnabled plugins 'vuex-electron'}}
  plugins: [
    ...vuexPlugins
  ],
  {{/isEnabled}}
  strict: process.env.NODE_ENV !== 'production'
})
