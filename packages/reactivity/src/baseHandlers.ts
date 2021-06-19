// 仅读的，set会报异常
// 深度的

import { extend, hasChanged, hasOwn, isArray, isIntegerKey, isObject } from '@vue/shared'
import { track ,trigger } from './effect'
import { TrackOpTypes, TriggerOpTypes } from './operations'
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
            // console.log('执行effect时取值，收集effect');
            track(target, TrackOpTypes.GET, key)
        }

        if (shallow) {
            return res
        }

        if (isObject(res)) { // 当取值时会进行代理，懒代理
            return isReadonly ? readonly(res) : reactive(res)
        }

        return res
    }
}

function createSetter (shallow: boolean = false) { // 拦截设置
    return function set (target, key, value, receiver) {
        const oldValue = target[key]
        let hadKey = isArray(target) && isIntegerKey(key) ?
            Number(key) < target.length : hasOwn(target, key)

        const result = Reflect.set(target, key, value, receiver) // target[key] = value
        // 数据更新时，通知对应属性的 effect 重新执行
        // 区分是新增还是修改，vue2里无法监控更改数组索引，更改数组长度 => hack，特殊处理

        if (!hadKey) { // 新增
            trigger(target, TriggerOpTypes.ADD, key, value)
        } else if(hasChanged(oldValue, value)) { // 修改
            trigger(target, TriggerOpTypes.SET, key, value, oldValue)
        }

        return result
    }
}