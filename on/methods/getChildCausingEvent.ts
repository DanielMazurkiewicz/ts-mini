export default (callback: (element: Node | undefined, zones: Node[], evt: Event) => any) => function(this: Node, evt: Event) {
    let current = <Node>evt.target;
    let previous: Node | undefined = current;
    let result: Node | undefined = current;
    let zones: Node[] = [];

    while (current !== null && this !== (current = <Node>current.parentNode)) {
        // @ts-ignore
        if (previous.getAttribute && previous.getAttribute('eventszone')) zones.unshift(previous);
        previous = current;
        result = previous;
    }
    callback(result, zones, evt);
}