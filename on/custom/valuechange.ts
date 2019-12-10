import input from '../names/input';
import keydown from '../names/keydown';
import keyup from '../names/keyup';
import mousedown from '../names/mousedown';
import mouseup from '../names/mouseup';
import select from '../names/select';
import contextmenu from '../names/contextmenu';
import drop from '../names/drop';

const eventsList = [input, keydown, keyup, mousedown, mouseup, select, contextmenu, drop];

import { TEventCallback } from '../methods/TEventCallback'

export default (callback: TEventCallback, options?: boolean | AddEventListenerOptions | undefined) => 
    (target: any) => {
        let oldValue: string, oldSelectionStart: number, oldSelectionEnd: number;
        eventsList.forEach(eventName => {
            target.addEventListener(eventName, (evt: Event) => {
                if (callback(evt)) {
                    oldValue = target.value;
                    oldSelectionStart = <number>target.selectionStart;
                    oldSelectionEnd = <number>target.selectionEnd;
                } else if (oldValue !== undefined) {
                    target.value = oldValue;
                    if (target.type !== 'email') { // firefox doesn't work with this for some reason
                        target.setSelectionRange(oldSelectionStart, oldSelectionEnd);
                    }
                }
            }, options)
        })
    }