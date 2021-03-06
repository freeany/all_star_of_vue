let Vue
class Store {
  constructor(options) {
    // this.$options = options
    this._mutations = options.mutations
    this._actions = options.actions
    this._getters = options.getters

    // this.state = new Vue({
    //   data: options.state
    // })

    this._vm = new Vue({
      data: {
        $$state: options.state
      },
      computed
    })

    // 给getter做一层代理
    for (let key in this._getters) {
      const _this = this
      Object.defineProperty(this.state, key, {
        get() {
          return _this._getters[key](_this.state)
        }
      })
    }

    // 因为commit 和 dispatch可能在外界会被改变this指向，bind下this
    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }
  commit(type, payload) {
    const entry = this._mutations[type]
    if (!entry) {
      console.error(`unknown type ${type} with commit`)
      return
    }
    entry(this.state, payload)
  }
  dispatch(type, payload) {
    const entry = this._actions[type]
    if (!entry) {
      console.error(`unknown type ${type} with dispatch`)
      return
    }
    entry(this, payload)
  }
  // 对state进行存取器的处理
  get state() {
    return this._vm._data.$$state
  }
  set state(v) {
    console.error('不可以直接修改state ' + v)
  }
}

function install(_Vue) {
  Vue = _Vue
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}
export default {
  Store,
  install
}
