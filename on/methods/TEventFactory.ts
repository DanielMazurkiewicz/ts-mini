import { TEventCallback } from "./TEventCallback";

export type TEventFactory = (callback: TEventCallback, options?: boolean | AddEventListenerOptions | undefined) => (target: any) => any
