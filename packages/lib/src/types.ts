import type { Component } from "./component"
import type { EffectTag } from "./constants"
import type { KaiokenGlobalContext } from "./globalContext"
import type {
  EventAttributes,
  GlobalAttributes,
  HtmlElementAttributes,
  SvgElementAttributes,
  SvgGlobalAttributes,
} from "./types.dom"

export type { ElementProps }

type ElementProps<T extends keyof JSX.IntrinsicElements> =
  JSX.IntrinsicElements[T] & {
    children?: JSX.Element[]
  }

type ElementMap = {
  [K in keyof HtmlElementAttributes]: HtmlElementAttributes[K] &
    GlobalAttributes &
    EventAttributes<K> &
    Kaioken.InternalProps &
    Partial<ARIAMixin>
} & {
  [K in keyof SvgElementAttributes]: SvgElementAttributes[K] &
    SvgGlobalAttributes &
    GlobalAttributes &
    EventAttributes<K> &
    Kaioken.InternalProps &
    Partial<ARIAMixin>
}

declare global {
  interface Window {
    __kaioken: KaiokenGlobalContext | undefined
  }
  namespace JSX {
    interface IntrinsicElements extends ElementMap {}

    type ElementKey = string | number
    type Element = Kaioken.VNode | string | number | null
  }
  export namespace Kaioken {
    type Context<T> = {
      Provider: ({ value, children }: ProviderProps<T>) => JSX.Element
      default: () => T | null
    }

    type FC<T = {}> = (props: FCProps<T>) => JSX.Element
    type FCProps<T = {}> = T & { children?: JSX.Element[] }

    type Hook<T> = T & { cleanup?: () => void; name?: string }

    type InternalProps = { ref?: Kaioken.Ref<Element>; key?: JSX.ElementKey }

    type Ref<T> = { current: T | null }

    type StateSetter<T> = T | ((prev: T) => T)

    type ProviderProps<T> = {
      value: T
      children?: JSX.Element[]
    }

    type Signal<T> = {
      value: T
      subscribe: (fn: (value: T) => void) => () => void,
      notify: () => void;
    }

    type VNode = {
      type: string | Function | typeof Component
      dom?: HTMLElement | SVGElement | Text
      instance?: Component
      props: {
        [key: string]: any
        children: VNode[]
        key?: JSX.ElementKey
        ref?: Kaioken.Ref<unknown>
      }
      index: number
      hooks?: Hook<unknown>[]
      parent?: VNode
      child?: VNode
      sibling?: VNode
      prev?: VNode
      effectTag?: (typeof EffectTag)[keyof typeof EffectTag]
    }
  }
}
