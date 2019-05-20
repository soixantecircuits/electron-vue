<template>
  <div>
    <div class="title">Information</div>
    <div class="items">
{{#isEnabled plugins 'vue-router'}}
      <div class="item">
        <div class="name">Path:</div>
        <div class="value">\{{ path }}</div>
      </div>
      <div class="item">
        <div class="name">Route Name:</div>
        <div class="value">\{{ name }}</div>
      </div>
{{/isEnabled}}
      <div class="item">
        <div class="name">Vue.js:</div>
        <div class="value">\{{ vue }}</div>
      </div>
      <div class="item" v-if="!isWeb">
        <div class="name">Electron:</div>
        <div class="value">\{{ electron }}</div>
      </div>
      <div class="item" v-if="!isWeb">
        <div class="name">Node:</div>
        <div class="value">\{{ node }}</div>
      </div>
      <div class="item">
        <div class="name">Platform:</div>
        <div class="value">\{{ platform }}</div>
      </div>
      {{#isEnabled plugins 'standard-settings'}}
      <div class="item">
        <div class="name">Custom Setting:</div>
        <div class="value">\{{ customSetting }}</div>
      </div>
      {{/isEnabled}}
      {{#isEnabled plugins 'vue-spacebro-client'}}
      <div class="item">
        <div class="name">Spacebro message:</div>
        <div class="value" id="message">\{{ message }}</div>
      </div>
      {{/isEnabled}}
    </div>
    {{#isEnabled plugins 'vue-spacebro-client'}}
    {{#isEnabled plugins 'vuex'}}
    <span v-html="media.meta.description" v-if="!media.url"></span>
    <img :src="media.url" :alt="media.meta.description" v-show="media.url"/>
    {{/isEnabled}}
    {{/isEnabled}}
  </div>
</template>

<script>
  {{#isEnabled plugins 'vue-spacebro-client'}}
  {{#isEnabled plugins 'vuex'}}
  import { mapState } from 'vuex'
  {{/isEnabled}}
  {{/isEnabled}}
  {{#isEnabled plugins 'standard-settings'}}
  import settings from '@/lib/settings'

  {{/isEnabled}}
  export default {
    data () {
      {{#isEnabled plugins 'standard-settings'}}
      let customSettingContent
      if (settings) {
        customSettingContent = settings.customSetting
      } else {
        customSettingContent = 'missing setting'
      }
      {{/isEnabled}}
      return {
        electron: process.versions.electron,
        {{#isEnabled plugins 'vue-router'}}
        name: this.$route.name,
        {{/isEnabled}}
        node: process.versions.node,
        {{#isEnabled plugins 'vue-router'}}
        path: this.$route.path,
        {{/isEnabled}}
        platform: require('os').platform(),
        {{#isEnabled plugins 'standard-settings'}}
        customSetting: customSettingContent,
        {{/isEnabled}}
        {{#isEnabled plugins 'vue-spacebro-client'}}
        message: 'start',
        {{/isEnabled}}
        vue: require('vue/package.json').version
      }
    },
    computed: {
      {{#isEnabled plugins 'vue-spacebro-client'}}
      {{#isEnabled plugins 'vuex'}}
      ...mapState({
        media: state => state.Media.media
      }),
      {{/isEnabled}}
      {{/isEnabled}}
      isWeb () {
        return typeof process !== 'undefined' && process.env.IS_WEB
      }
    },
    {{#isEnabled plugins 'vue-spacebro-client'}}
    spacebroEvents: {
      connect: function () {
        this.$spacebro.emit(this.$spacebro.config.client.out.outMessage.eventName, {message: 'thank you'})
      },
      inMessage: function (data) {
        this.message = data.message
      }
    }
    {{/isEnabled}}
  }
</script>

<style scoped>
  .title {
    color: #888;
    font-size: 18px;
    font-weight: initial;
    letter-spacing: .25px;
    margin-top: 10px;
  }

{{#isEnabled plugins 'vue-spacebro-client'}}
  img {
    margin-top: 10px;
  }

{{/isEnabled}}
  .items { margin-top: 8px; }

  .item {
    display: flex;
    margin-bottom: 6px;
  }

  .item .name {
    color: #6a6a6a;
    margin-right: 6px;
  }

  .item .value {
    color: #35495e;
    font-weight: bold;
  }
</style>
