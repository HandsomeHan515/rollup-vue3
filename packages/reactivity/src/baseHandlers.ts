// 仅读的，set会报异常
// 深度的

import { extend, isObject } from '@vue/shared'
import { reactive, readonly } from './reactive'

const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

const set = createSetter()
const shallowSet = createSetter(true)

export const mutableHandlers = {
    get,
    set
}

export const shallowReactiveHandlers = {
    get: shallowGet,
    set: shallowSet
}

let readonlyObj = {
    set: (target, key) => {
        console.warn(`${target}'s key ${key} is readonly`)
    }
}

export const readonlyHandlers = extend({
    get: readonlyGet,
}, readonlyObj)

export const shallowReadonlyHandlers = extend({
    get: shallowReadonlyGet
}, readonlyObj)

function createGetter (isReadonly: boolean = false, shallow: boolean = false) { // 拦截获取
    return function get (target, key, receiver) {
        const res = Reflect.get(target, key, receiver) // target[key]
        if (!isReadonly) {
            // 收集依赖，数据变化后更新对应的视图
        }

        if (shallow) {
            return res
        }

        if (isObject) { // 当取值时会进行代理，懒代理
            return isReadonly ? readonly(res) : reactive(res)
        }

        return res
    }
}

function createSetter (shallow: boolean = false) { // 拦截设置
    return function set (target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver) // target[key] = value

        return result
    }
}