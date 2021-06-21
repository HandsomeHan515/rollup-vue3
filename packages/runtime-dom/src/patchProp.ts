import { isOn } from '@vue/shared'
import { patchAttr } from './modules/attrs'
import { patchClass } from './modules/class'
import { patchEvent } from './modules/events'
import { patchStyle } from './modules/style'

export const patchProp = (el, key, prevValue, nextValue, isSVG: false) => {
    switch(key) {
    case 'calss':
        patchClass(el, nextValue, isSVG)
        break
    case 'style':
        patchStyle(el, prevValue, nextValue)
        break
    default:
        if (isOn(key)) {
            patchEvent(el, key, prevValue, nextValue)
        } else {
            patchAttr(el, key, nextValue, isSVG)
        }
    }
}