import { TEventCallback } from './TEventCallback'
import { TEventFactory } from './TEventFactory'

export default (eventName: string): TEventFactory => (callback: TEventCallback, options?: boolean | AddEventListenerOptions | undefined) => 
    (target: any) => target.addEventListener(eventName, callback, options)
