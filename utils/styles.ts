import { getStyleName, IStyleId } from '../tss/tss';

// STYLES


export const useAsStyle = (alias: any, style: IStyleId) => {
    alias.__tsm_sid = style.__tsm_sid
    return alias;
}

export const styleAdd = (element: HTMLElement, styles: any[]) => {
    element.classList.add(...styles.map(getStyleName));
    return element;
}

export const styleRemove = (element: HTMLElement, styles: any[]) => {
    element.classList.remove(...styles.map(getStyleName));
    return element;
}
