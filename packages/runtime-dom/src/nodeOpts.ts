const doc = (typeof document !== 'undefined' ?document : null ) as Document

export const nodeOpts = {
    createElement: (tag) => {
        return doc.createElement(tag)
    },
    remove: child => {
        const parent = child.parentNode
        if (parent) {
            parent.removeChild(child)
        }
    },
    insert: (child, parent, anchor) => {
        parent.insertBefore(child, anchor || null)
    },
    createText: text => doc.createTextNode(text),
    createComment: text => doc.createComment(text),
    setText: (node, text) => {
        node.nodeValue = text
    },
    setElementText: (el, text) => {
        el.textContent = text
    },
    parentNode: node => node.parentNode as Element | null,
    nextSibling: node => node.nextSibling,
    querySelector: selector => doc.querySelector(selector)
}
