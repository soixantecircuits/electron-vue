<template>
  <div class="sw">
    <div class="title alt">Service worker</div>
    <div> This is a dynamic image, it changes on each request: </div>
    <img id="online" src="https://loremflickr.com/g/320/240/pareidolie" alt="static asset">
    <div v-if="!settings.serviceWorker.cacheFirst">
      Service worker is enabled wih priority to network, and fallback on cache if no network.<br/>
      1. Refresh this page and you will see a new picture, refresh again, and again. <br/>
      2. Disconnect from network, refresh and you will still see the last picture, it's not gone. Refresh and refresh, it is still here.<br/>
      3. You can also run service worker with priority to cache <div class="value">yarn dev --serviceWorker.cacheFirst true</div>.
    </div>
    <div v-else>
      Service worker is enabled with priority to cache, so content is only fetched once.<br/>
      1. Refresh this page. If this is the first time you run the app, the image above was downloaded before the service-worker was installed, so it will change once: refresh again.<br/>
      2. The image does not change. Refresh again and again, it is still the same.
    </div>
  </div>
</template>

<script>
  import settings from '@/lib/settings'

  export default {
    computed: {
      settings () {
        return settings
      }
    }
  }
</script>

<style scoped>
 img {
   margin: 10px 0;
 }
</style>
