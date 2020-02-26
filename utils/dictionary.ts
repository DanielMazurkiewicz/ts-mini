export interface IDictionary<KeyType> {
    add: (key: KeyType) => number;
    id: (key: KeyType) => number | undefined;
    key: (id: number) => any;
    length: () => number;
}

export default <KeyType>(initialId: number = 0): IDictionary<KeyType> => {
    const map = new Map<any, number>();
    const list: Array<KeyType> = [];

    const add = (key: KeyType) => {
        const id = list.length + initialId;
        list.push(key);
        map.set(key, id)
        return id;
    }

    const id = (key: KeyType) => map.get(key);
    const key = (id: number) => list[id - initialId];
    const length = () => list.length

    return {
        add, id, key, length
    } 
}