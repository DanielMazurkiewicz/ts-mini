import getStyleName from "../tss/methods/getStyleName";

// STYLES

export const styleAdd = (element: HTMLElement, styles: any[]) => {
    element.classList.add(...styles.map(getStyleName));
    return element;
}

export const styleRemove = (element: HTMLElement, styles: any[]) => {
    element.classList.remove(...styles.map(getStyleName));
    return element;
}
