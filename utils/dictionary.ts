export interface IDictionary {
    add: (word: string) => number;
    getId: (word: string) => number;
    getWord: (id: number) => string;
    exist: (word: string) => boolean;
    length: () => number;
}

export default (initialId: number = 0): IDictionary => {
    const record: Record<string, number> = {}
    const list: Array<string> = [];

    const exist = (word: string) => record[word] !== undefined;

    const add = (word: string) => {
        const id = list.length + initialId;
        list.push(word);
        record[word] = id;
        return id;
    }

    const getId = (word: string) => record[word];
    const getWord = (id: number) => list[id - initialId];
    const length = () => list.length

    return {
        exist, add, getId, getWord, length
    } 
}