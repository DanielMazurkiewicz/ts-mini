import uid from '../../utils/uid'
import addEventListenerFactory from './addEventListenerFactory';
import { TEventCallback } from './TEventCallback';
import { TEventFactory } from './TEventFactory';

interface IEventFire extends TEventFactory {
    $: (element: EventTarget) => any
}

export default (bubbles?: boolean | undefined, cancelable?: boolean | undefined): IEventFire => {
    const id = uid();
    const on = addEventListenerFactory(id);

    // @ts-ignore
    on.$ = (element: EventTarget) => {
        const event = document.createEvent("HTMLEvents");
        event.initEvent(id, bubbles, cancelable);
        element.dispatchEvent(event);
    }

    // @ts-ignore
    return on; 
}

/*
USAGE:

export const onmyevent = event(); // registers new event

const mycomponent = () => {
    const comonent = div();
    onmyevent.$(decorator)        // fires that event
    return decorator;
}

*/