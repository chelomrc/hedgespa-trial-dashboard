import '@testing-library/jest-dom/vitest'

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverStub

const layoutRect = {
  width: 400,
  height: 300,
  top: 0,
  left: 0,
  bottom: 300,
  right: 400,
  x: 0,
  y: 0,
  toJSON: () => layoutRect,
} as DOMRect

Object.defineProperty(Element.prototype, 'getBoundingClientRect', {
  configurable: true,
  value: () => layoutRect,
})
