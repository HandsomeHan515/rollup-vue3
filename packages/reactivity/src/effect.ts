export function effect(fn, options: any = {}) {
    // 将effect变成响应式的，当数据变化时进行更新操作
    const effect = createReactiveEffect(fn, options)

    if (!options.lazy) { // 默认的 effect 先执行一次
        effect()
    }
    return effect
}

let uid = 0
let activeEffect // 存储当前的 effect 
const effectStack = []
function createReactiveEffect(fn, options) {
    const effect = function reactiveEffect() {
        if (!effectStack.includes(effect)) { // 保证 effect 没有加入到 stack 中 effect(() => {state.age++})
            try {
                effectStack.push(effect)
                activeEffect = effect
                return fn()
            } finally {
                effectStack.pop()
                activeEffect = effectStack[effectStack.length -1]
            }
        }
    }
    effect.id = uid++ // effect 标识，用于区分 effect
    effect._isEffect = true // 用于标识这个是个相应式的 effect 
    effect.raw = fn // effect 对应的原函数
    effect.options = options // 属性
    return effect
}

// 让某个对象中的属性，收集他对应的 effect 
const targetMap = new WeakMap()
export function track(target, type, key) {
    // console.log(target, key, activeEffect);
    if (activeEffect === undefined) {
        return
    }
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    } 
    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, (dep = new Set()))
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect)
    }

    console.log(targetMap);
    
}