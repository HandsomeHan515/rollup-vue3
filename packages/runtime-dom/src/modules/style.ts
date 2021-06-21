import { isString } from '@vue/shared'

export function patchStyle (el: Element, prev, next) {
    const style = (el as HTMLElement).style
    if (!next) {
        el.removeAttribute('style')
    } else if (isString(next)) {
        if (prev !== next) {
            const current = style.display
            style.cssText = next
        } else {
            for (const key in next) {

            }
        }
    }

}