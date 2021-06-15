import { isObject } from "@vue/shared"
import {
    mutableHandlers,
    shallowReactiveHandlers,
    readonlyHandlers,
    shallowReadonlyHandlers
} from './baseHandlers'


export function reactive(target) {
    return createReactiveObject(target, false, mutableHandlers)
}

export function shallowReactive(target) {
    return createReactiveObject(target, false, shallowReactiveHandlers)

}

export function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers)

}

export function shallowReadonly(target) {
    return createReactiveObject(target, true, shallowReadonlyHandlers)
}

const reactiveMap = new WeakMap()
const readonlyMap = new WeakMap()

// 是不是仅读的 readonly 需不需要深度遍历 shallow，柯里化
export function createReactiveObject(target, isReadonly, baseHandlers) {
    if (!isObject) {
        return target
    }
    // 如果某个对象已经代理过了，则不需要再次代理
    // 可能一个对象被代理的是深度，又被代理仅读了
    const proxyMap = isReadonly ? readonlyMap : reactiveMap
    const existProxy = proxyMap.get(target)
    if (existProxy) {
        return existProxy // 如果已经代理过了，直接返回即可
    }

    const proxy = new Proxy(target, baseHandlers)

    return proxy
}