// Substitute names for attributes which are invalid JS literals.
const specialAttributeNames = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv',
}

export default function h(tag, attrs, children) {
  const el = document.createElement(tag)

  if (attrs) {
    Object.keys(attrs).forEach((attrName) => {
      // The 'style' attribute is an object of style props to set.
      if (attrName === 'style') {
        Object.keys(attrs.style).forEach((styleAttrName) => {
          el.style[styleAttrName] = attrs.style[styleAttrName]
        })
        return
      }

      // Attribute names starting with 'on' register events.
      if (attrName.startsWith('on')) {
        el.addEventListener(attrName.substr(2).toLowerCase(), attrs[attrName], false)
        return
      }

      // We need to rename some property names which conflict with reserved keywords.
      let htmlAttrName = attrName
      if (Object.prototype.hasOwnProperty.call(specialAttributeNames, attrName)) {
        htmlAttrName = specialAttributeNames[attrName]
      }
      el.setAttribute(htmlAttrName, attrs[attrName])
    })
  }

  if (children) {
    if (typeof children === 'string') {
      el.textContent = children
    } else {
      children.forEach((childEl) => {
        if (typeof childEl === 'string') {
          el.appendChild(document.createTextNode(childEl))
        } else {
          el.appendChild(childEl)
        }
      })
    }
  }

  return el
}
