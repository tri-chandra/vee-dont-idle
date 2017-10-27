import Vue from 'vue'
import App from './example.vue'
import pinger from './UpCommandPlugin'

Vue.use(pinger, {
  restartCallback() { },
  periodicCallback() {
    console.log('heart beat ...')
  },
  interval: 2000,
  stopTime: 5000,
  stoppedCallback(parent) {
    console.log('stopped')
  }
})

new Vue({
  el: '#app',
  render: h => h(App)
})