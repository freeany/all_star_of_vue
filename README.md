# vue响应式原理

1. newVue()首先执行初始化，对**data**执行响应化处理，这个过程发生在Observer中
2. 同时对模板执行编译，找到其中动态绑定的数据，从data中获取并初始化视图，这个过程发生在Compile中
3. 同时定义一个更新函数和Watcher，将来对应数据变化时Watcher会调用更新函数
4. 由于data的某个key在一个视图中可能出现多次，所以每个key都需要一个管家Dep来管理多个Watcher
5. 将来data中数据一旦发生变化，会首先找到对应的Dep，通知所有Watcher执行更新函数

<img src="/Users/lihaoran/Library/Application Support/typora-user-images/image-20210306114052701.png" alt="image-20210306114052701" style="zoom:100%;" />

:aerial_tramway: : 拦截选项中传递过来的data，进行拦截和响应式处理。

:fist_raised::  对模版进行编译， 在编译的过程中将动态的部分找出来，也就是依赖。

:chart_with_downwards_trend:: 执行render函数时，会对数据进行get，当get的时候observe会拦截get请求，知道有地方用到我了，创建观察者模式，每个属性都有一个dep(收集依赖)， wather就代表页面中的动态的部分，也就是依赖。

:middle_finger::当数据发生变化时， 就会触发set函数，将该属性所对应的dep中的watcher全部触发更新。





