/**
 * 1. 需要被Vue.use
 * 2. 需要被new
 */
let Vue
class VueRouter {
  constructor(options) {
    this.$options = options
    // this.current = '/'
    // 让current变为可响应的
    this.current = Vue.observable({ path: '/' })
    window.addEventListener('hashchange', this.onHashChange.bind(this))
  }
  onHashChange() {
    this.current.path = window.location.hash.slice(1)
  }
}

// 插件的作用用于添加一些全局的方法/资源/混入全局组件选项
// 插件的注册在new Vue实例之前
/**
 *
 * @param {*} _Vue
 * 需要根据Vue做两件事情
 *  1. 挂载$router
 *  2. 注册router-view/router-link选项
 */
VueRouter.install = function(_Vue) {
  Vue = _Vue
  // 全局添加$router选项，每一个组件都可能会用, 此时vue实例尚未注册，所以用mixin的形式，每个组件中都有vueRouter的实例。
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      }
    }
  })
  // 注册全局组件
  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        require: true
      }
    },
    render(h) {
      return h('a', { attrs: { href: '#' + this.to } }, this.$slots.default)
    }
  })
  Vue.component('router-view', {
    render(h) {
      // 前提是current是响应式的，当current变化时，会触发渲染watcher执行。即重新执行render函数
      // 需要拿到vueRouter实例，vueRouter的constructor中有current
      const { $options, current } = this.$router
      const routes = $options.routes
      const route = routes.find(route => route.path === current.path)
      let component = ''
      if (route) {
        component = route.component
      }
      return h(component)
    }
  })
}

export default VueRouter
