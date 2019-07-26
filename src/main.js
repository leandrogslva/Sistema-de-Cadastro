import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import vuetify from './plugins/vuetify'
import {routes} from './routes'
import VueRouter from 'vue-router'
import {store} from './store/store'
import './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Vuetify)
Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  mode:'history'
})

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
