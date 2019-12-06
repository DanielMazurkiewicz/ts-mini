import input from '../input';
import keydown from '../keydown';
import keyup from '../keyup';
import mousedown from '../mousedown';
import mouseup from '../mouseup';
import select from '../select';
import contextmenu from '../contextmenu';
import drop from '../drop';

import { TEventCallback } from '../methods/TEventCallback'

// export const list = [
//     input, keydown, keyup, mousedown, mouseup, select, contextmenu, drop
// ]

export default (callback: TEventCallback, options?: boolean | AddEventListenerOptions | undefined) => [
    input(callback, options),
    keydown(callback, options),
    keyup(callback, options),
    mousedown(callback, options),
    mouseup(callback, options),
    select(callback, options),
    contextmenu(callback, options),
    drop(callback, options),
]
