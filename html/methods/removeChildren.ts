export default (element: Node, keepFirst = 0) => {
    while (keepFirst < element.childNodes.length) {
        element.removeChild(<Node>element.lastChild);
    }
}
