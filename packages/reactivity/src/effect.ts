import { isArray, isIntegerKey } from '@vue/shared'
import { TriggerOpTypes } from './operations'

export function effect (fn, options: any = {}) {
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
function createReactiveEffect (fn, options) {
    const effect = function reactiveEffect () {
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
export function track (target, type, key) {
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

    // console.log(targetMap);
    
}

export function trigger (target, type, key?, newValue?, oldValue?) {
    // 如果这个属性没被收集过，则不需要处理
    const depsMap = targetMap.get(target)
    if (!depsMap) return

    const effects = new Set() // 做去重操作
    const add = effectsToAdd => {
        if (effectsToAdd) {
            effectsToAdd.forEach(effect => effects.add(effect));
        }
    }
    // 将所有要执行的 effect 全部存到一个新的集合中，最终一起执行
    // 1.是不是修改数组的长度
    if(key === 'length' && isArray(target)) {
        depsMap.forEach((dep, key) => {
            if (key === 'length' || key > newValue) {
                // 如果更改的长度小于收集的索引，那么这个索引也要触发 effect 执行
                add(dep)
            }
        })
    } else {
        // 是对象
        if(key !== undefined) {
            add(depsMap.get(key))
        }

        // 修改数组中的某个索引 let arr = [1,2,3]; arr[100] = 1
        switch(type) { // 如果添加了一个索引就触发长度更新
        case TriggerOpTypes.ADD:
            if (isArray(target) && isIntegerKey(key)) {
                add(depsMap.get('length'))  
            }
        }
    }
    effects.forEach((effect: any) => {
        if (effect.options.scheduler) {
            effect.options.scheduler()
        } else {
            effect()
        }
    })
}