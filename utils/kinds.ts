// FOR FUTURE USE PROBABLY

let kindId = 1;

export const kindPrefix = '__tsm_';
export const kindName = kindPrefix + 'k';
export const valueName = kindPrefix + 'v';


export interface IKind {
    __tsm_k: number
    __tsm_v: any
}

export const newKind = () => {
    const id = kindId++;
    const newElementOfKind = (value: any = undefined, source: any = {}) => {
        source[kindName] = id;
        source[valueName] = value;
    }
    // @ts-ignore
    newElementOfKind[kindName] = 0;
    // @ts-ignore
    newElementOfKind[valueName] = id;
    return newElementOfKind
}

export const getKindId = (element: any) => element[kindName]
export const getKindValue = (element: any) => element[valueName];

export const isKind = (element: any, kindConstructor: any) => (kindConstructor[kindName] === 0) && (kindConstructor[valueName] === element[kindName]);
