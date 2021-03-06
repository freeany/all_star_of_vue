import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'

// import router from './router'
import router from './myRouter'

// import store from './store'
import store from './myStore'

Vue.config.productionTip = false
// 事件总线
Vue.prototype.$bus = new Vue()

// this.$router.push()
// Vue.prototype.$router = router
const vm = new Vue({
  router,
  store,
  axy: 1,
  render: h => h(App)
}).$mount('#app')

// console.log(vm.$options)
