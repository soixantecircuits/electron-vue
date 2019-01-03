const state = {
  media: {
    url: '',
    meta: {
      description: '⚠️ - Press "Send media" to show an image =>'
    }
  }
}

const mutations = {
  SPACEBRO_INMEDIA (state, media) {
    state.media = media
  }
}

export default {
  state,
  mutations
}
