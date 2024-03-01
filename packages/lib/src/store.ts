import { nodeToCtxMap } from "./globalContext.js"
import { shouldExecHook, useHook } from "./hooks/utils.js"
import { shallow } from "./shallow.js"

export { createStore }

type MethodFactory<T> = (
  setState: (setter: Kaioken.StateSetter<T>) => void,
  getState: () => T
) => Record<string, (...args: any[]) => void>

type Store<T, U extends MethodFactory<T>> = {
  <Selector extends (state: T) => unknown>(
    fn: Selector
  ): { value: T } & ReturnType<U>
  (): { value: T } & ReturnType<U>
  getState: () => T
  setState: (setter: Kaioken.StateSetter<T>) => void
  methods: ReturnType<U>
  subscribe: (fn: (value: T) => void) => () => void
} & ReturnType<U>

const nodeToComputeMap = new WeakMap<Kaioken.VNode, [Function, unknown][]>()

function createStore<T, U extends MethodFactory<T>>(
  initial: T,
  methodFactory: U
) {
  let value = initial
  const subscribers = new Set<Kaioken.VNode | Function>()
  const getState = () => value
  const setState = (setter: Kaioken.StateSetter<T>) => {
    value = setter instanceof Function ? setter(value) : setter
    subscribers.forEach((n) => {
      if (n instanceof Function) return n(value)
      const computes = nodeToComputeMap.get(n)
      if (computes) {
        let computeChanged = false
        for (let i = 0; i < computes.length; i++) {
          const [fn, slice] = computes[i]

          const next = fn(value)
          if (shallow(next, slice)) continue

          computeChanged = true
          computes[i] = [fn, next]
        }
        if (!computeChanged) return
      }

      nodeToCtxMap.get(n)!.requestUpdate(n)
    })
  }
  const methods = methodFactory(setState, getState) as ReturnType<U>

  function useStore<Selector extends (state: T) => unknown>(fn?: Selector) {
    if (!shouldExecHook()) return { value, ...methods }

    return useHook("useStore", {}, ({ hook, oldHook, vNode }) => {
      if (!oldHook) {
        const stateSlice = fn ? fn(value) : value
        if (fn) {
          const computes = nodeToComputeMap.get(vNode) ?? []
          computes.push([fn, stateSlice])
          nodeToComputeMap.set(vNode, computes)
        }
        subscribers.add(vNode)
        hook.cleanup = () => subscribers.delete(vNode)
      }

      return { value, ...methods }
    })
  }

  return Object.assign(useStore, {
    getState,
    setState,
    methods,
    subscribe: (fn: (state: T) => void) => {
      subscribers.add(fn)
      return (() => (subscribers.delete(fn), void 0)) as () => void
    },
  }) as Store<T, U>
}
