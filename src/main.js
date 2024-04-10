import Vue from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import { Icon, Button, ColorPicker, Cascader } from 'element-ui'
import { Buffer } from 'buffer/'

import App from './App.vue'
 import router from './router'

import './assets/main.css'

Vue.use(PiniaVuePlugin)
Vue.use(Icon)
Vue.use(Button)
Vue.use(Buffer)
Vue.use(ColorPicker)
Vue.use(Cascader)
// asdsadad
new Vue({
  router,
  pinia: createPinia(),
  render: (h) => h(App)
}).$mount('#app')
