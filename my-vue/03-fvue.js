const watchers = []

function defineReactive(obj, key, value) {
  let dep = new Dep()

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      //   console.log('get', value)
      if (Dep.target) {
        dep.addDeps(Dep.target)
      }
      return value
    },
    set(v) {
      if (v !== value) {
        // console.log('set', value)
        value = v
        // watchers.forEach(w => w.update())
        dep.notify()
      }
    }
  })
}
// 定义vue类
class Fvue {
  // 在constructor里面分工明确
  constructor(options) {
    this.$options = options
    this.$data = options.data
    this.$el = options.el
    this.$methods = options.methods
    new Observer(options.data)
    this.proxy(this)
    new Compile(this.$el, this)
  }
  // 代理data中的数据
  proxy(vm) {
    const data = vm.$data
    Object.keys(data).forEach(key => {
      Object.defineProperty(vm, key, {
        get() {
          return data[key]
        },
        set(v) {
          data[key] = v
        }
      })
    })
  }
}

// 定义一个类专门处理响应式数据，让Fvue足够简洁
class Observer {
  constructor(value) {
    this.value = value
    this.observe(value)
  }
  observe(value) {
    if (typeof value !== 'object') return
    if (Array.isArray(value)) {
      // todo
    } else {
      Object.keys(value).forEach(key => {
        defineReactive(value, key, value[key])
        if (typeof value[key] === 'object') {
          this.observe(value[key])
        }
      })
    }
  }
}

class Compile {
  constructor(el, vm) {
    this.$vm = vm
    this.$el = document.querySelector(el)

    if (this.$el) {
      this.compile(this.$el)
    }
  }
  compile(el) {
    const childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if (this.isElement(node)) {
        // console.log('编译元素' + node.nodeName)
        this.compileElement(node)
      } else if (this.isInterpolation(node)) {
        // console.log('编译插值文本' + node.textContent)
        this.compileText(node)
      }
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node)
      }
    })
  }
  isElement(node) {
    return node.nodeType == 1
  }
  isInterpolation(node) {
    return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
  compileText(node) {
    // node.textContent = this.$vm[RegExp.$1]
    this.update(RegExp.$1, 'text', node)
  }

  compileElement(node) {
    let nodeAttrs = node.attributes
    Array.from(nodeAttrs).forEach(attr => {
      let attrName = attr.name
      let exp = attr.value
      if (this.isDirective(attrName)) {
        let dir = attrName.substring(2)
        this[dir] && this[dir](node, exp) // 策略模式
      } else if (this.isEventHandler(attrName)) {
        let eventName = attrName.substring(1)
        window.addEventListener(eventName, e => {
          this.eventHandler(exp)(e)
        })
      }
    })
  }
  eventHandler = exp => {
    return e => {
      this.$vm.$methods[exp](e)
    }
  }
  isDirective(attr) {
    return attr.indexOf('f-') == 0
  }
  isEventHandler(attr) {
    return attr.indexOf('@') == 0
  }
  update(exp, type, node) {
    const fn = this[type + 'Updatar']
    fn && fn(exp, node)
    // 又是一个闭包
    new Watcher(this.$vm, exp, () => {
      fn && fn(exp, node)
    })
  }
  text(node, exp) {
    // node.textContent = this.$vm[exp]
    this.update(exp, 'text', node)
  }
  textUpdatar = (exp, node) => {
    node.textContent = this.$vm[exp]
  }
  html(node, exp) {
    // node.innerHTML = this.$vm[exp]
    this.update(exp, 'html', node)
  }
  htmlUpdatar = (exp, node) => {
    node.innerHTML = this.$vm[exp]
  }
}

class Watcher {
  // 当数据变化时，执行watcher，wathcer的第三个回调函数更新页面，但是要知道更新的数据是什么，所以需要vm和key这两个属性
  constructor(vm, key, expFn) {
    this.vm = vm
    this.key = key
    this.expFn = expFn
    // watchers.push(this)
    Dep.target = this // 将dep和watcher建立联系，这里太巧妙了， 这三步连在一起加上get方法太巧妙了。
    this.vm[this.key]
    Dep.target = null
  }
  update() {
    // 已经拿到了最新的 this.vm[this.key]
    this.expFn.call(this.vm, this.vm[this.key])
  }
}

// 收集依赖
class Dep {
  static target = null

  constructor() {
    this.deps = []
  }
  addDeps(watcher) {
    this.deps.push(watcher)
  }
  notify() {
    // console.log(this.deps)
    this.deps.forEach(w => w.update())
  }
}
