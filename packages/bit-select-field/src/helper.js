/* eslint-disable import/prefer-default-export */
export function observeElm(element, property, callback, delay = 0) {
  const elementPrototype = Object.getPrototypeOf(element)
  if (Object.prototype.hasOwnProperty.call(elementPrototype, property)) {
    const descriptor = Object.getOwnPropertyDescriptor(
      elementPrototype,
      property,
    )
    Object.defineProperty(element, property, {
      configurable: true,
      get(...args) {
        return descriptor.get.apply(this, args)
      },
      set(...args) {
        const oldValue = this[property]
        descriptor.set.apply(this, args)
        const newValue = this[property]
        if (typeof callback === 'function') {
          setTimeout(callback.bind(this, oldValue, newValue), delay)
        }
        return newValue
      },
    })
  }
}
