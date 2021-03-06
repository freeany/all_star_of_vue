// 更新页面的update函数
function update(v) {
  const app = document.querySelector('#app')
  app.innerHTML = v
}

function defineReactive(obj, key, value) {
  observer(value)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      console.log('get', JSON.parse(JSON.stringify(value)))
      return value
    },
    set(v) {
      console.log('set', v)
      if (v === value) return
      value = v
      update(v)
    }
  })
}

const obj = {
  a: 1,
  b: 2,
  c: { d: 12 }
}

function observer(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return
  }
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}
function set(obj, key, value) {
  defineReactive(obj, key, value)
}
observer(obj)
