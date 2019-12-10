
export const show = (element: HTMLElement) => {
    element.style.display = (<any>element).__displayBackup || '';
    delete (<any>element).__displayBackup;
}

export const hide = (element: HTMLElement) => {
    (<any>element).__displayBackup = element.style.display;
    element.style.display = 'none'
}