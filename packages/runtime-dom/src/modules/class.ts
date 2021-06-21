export function patchClass (el: Element, value: string | null , isSvg: boolean) {
    if (value === null) {
        value = ''
    }
    if (isSvg) {
        el.setAttribute('class', value)
    } else {
        el.className = value
    }
}