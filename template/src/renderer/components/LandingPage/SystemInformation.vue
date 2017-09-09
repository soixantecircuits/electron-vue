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
      <div class="item">
        <div class="name">Electron:</div>
        <div class="value">\{{ electron }}</div>
      </div>
      <div class="item">
        <div class="name">Node:</div>
        <div class="value">\{{ node }}</div>
      </div>
      <div class="item">
        <div class="name">Platform:</div>
        <div class="value">\{{ platform }}</div>
      </div>
      {{#if settings}}
      <div class="item">
        <div class="name">Custom Setting:</div>
        <div class="value">\{{ customSetting }}</div>
      </div>
      {{/if}}
      {{#isEnabled plugins 'vue-spacebro-client'}}
      <div class="item">
        <div class="name">Spacebro message:</div>
        <div class="value" id="message">\{{ message }}</div>
      </div>
      {{/isEnabled}}
    </div>
    {{#isEnabled plugins 'vue-spacebro-client'}}
    <img :src="media.url" :alt="media.meta.description"/></img>
    {{/isEnabled}}
  </div>
</template>

<script>
  {{#isEnabled plugins 'vue-spacebro-client'}}
  {{#isEnabled plugins 'vuex'}}
  import { mapState } from 'vuex'
  {{/isEnabled}}
  {{/isEnabled}}
  {{#if settings}}
  import settings from '@/lib/settings'

  {{/if}}
  export default {
    {{#isEnabled plugins 'vue-spacebro-client'}}
    {{#isEnabled plugins 'vuex'}}
    computed: mapState({
      media: state => state.Media.media
    }),
    {{/isEnabled}}
    spacebroEvents: {
      connect: function () {
        this.$spacebro.emit(this.$spacebro.config.client.out.outMessage.eventName, {message: 'thank you'})
      },
      inMessage: function (data) {
        this.message = data.message
      }
    },
    {{/isEnabled}}
    data () {
      {{#if settings}}
      let customSetting
      if (settings) {
        customSetting = settings.customSetting
      } else {
        customSetting = 'missing setting'
      }

      {{/if}}
      return {
        electron: process.versions['atom-shell'],
        {{#isEnabled plugins 'vue-router'}}
        name: 'landing-page',
        {{/isEnabled}}
        node: process.versions.node,
        {{#isEnabled plugins 'vue-router'}}
        path: '/',
        {{/isEnabled}}
        platform: require('os').platform(),
        {{#if settings}}
        customSetting: customSetting,
        {{/if}}
        {{#isEnabled plugins 'vue-spacebro-client'}}
        message: 'start',
        {{/isEnabled}}
        vue: require('vue/package.json').version
      }
    }
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
