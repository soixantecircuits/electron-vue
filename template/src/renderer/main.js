import Vue from 'vue'
{{#isEnabled plugins 'axios'}}
import axios from 'axios'
{{/isEnabled}}

import App from './App'
{{#isEnabled plugins 'vue-router'}}
import router from './router'
{{/isEnabled}}
{{#isEnabled plugins 'vuex'}}
import store from './store'
{{/isEnabled}}
{{#isEnabled plugins 'vue-spacebro-client'}}
import VueSpacebroClient from 'vue-spacebro-client'
{{#if settings}}
import settings from '@/lib/settings'
{{/if}}
{{/isEnabled}}

{{#isEnabled plugins 'vue-electron'}}
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
{{/isEnabled}}
{{#isEnabled plugins 'axios'}}
Vue.http = Vue.prototype.$http = axios
{{/isEnabled}}
Vue.config.productionTip = false

{{#isEnabled plugins 'vue-spacebro-client'}}
{{#if settings}}
Vue.use(VueSpacebroClient, settings.service.spacebro, store)
{{else}}
let config = {
  host: 'spacebro.space',
  port: 3333,
  channelName: 'media-stream'
  client: {
    name: 'vue-example',
    description: 'exemple app',
    in: {
      inMedia: {
        eventName: 'inMedia',
        description: 'Input media',
        type: 'all'
      }
    },
    out: {
      outMedia: {
        eventName: 'outMedia',
        description: 'Output media',
        type: 'all'
      }
    }
  },
  connection: [
    "vue-example/outMedia => vue-example/inMedia",
    "vue-example/outMessage => vue-example/inMessage"
  ]
}
Vue.use(VueSpacebroClient, config, store)
{{/if}}

{{/isEnabled}}
/* eslint-disable no-new */
new Vue({
  components: { App },
  {{#isEnabled plugins 'vue-router'}}
  router,
  {{/isEnabled}}
  {{#isEnabled plugins 'vuex'}}
  store,
  {{/isEnabled}}
  template: '<App/>'
}).$mount('#app')
