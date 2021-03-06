import text from '../html/text'
import { setAttribs } from './attributes';
// import appendChild from '../html/methods/appendChild'
import throwError from './throwError'
import { ERROR_DECORATOR_UNKNOWN_CHILD } from '../ERRORS';
import getStyleName from '../tss/methods/getStyleName';

const decorator = (element: Node | string, children: any[]) => {
    if (typeof element === 'string') element = document.createElement(element);
    for(let i = 0; i < children.length; i++) {
        const child = children[i];
        let styleName: string

        if (child instanceof Node) {
            // @ts-ignore
            element.appendChild(child);
        } else if (!(styleName = getStyleName(child)) && typeof child === 'function') {
            const result = child(element);
            if (result) decorator(element, [result])
        } else if (child instanceof Array) {
            decorator(element, child);
        } else if (typeof child === 'string') {
            // @ts-ignore
            element.appendChild(text(child));
        } else if (element instanceof HTMLElement) {
            if (styleName) {
                element.classList.add(styleName)
            } else {
                setAttribs(element, child);
            }
        } else {
            throwError(ERROR_DECORATOR_UNKNOWN_CHILD)
        }
    }
    return element;
}

export default decorator;