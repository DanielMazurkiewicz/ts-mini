export default (parent: Node, child: Node) => {
    const childNodes = parent.childNodes;
    const count = childNodes.length;

    for (let i = 0; i < count; ++i) {
        if (child === childNodes[i]) {
            return i
        }
    }
    return -1;
}