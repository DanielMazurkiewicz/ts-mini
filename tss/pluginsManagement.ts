import { ITSStyle } from "./structures/ITSStyle";

export type TPlugin = (name: string, style: ITSStyle, computedStyle: ITSStyle) => void

// Native TSS properties that are reserved are defined here
export const reservedProperties: ITSStyle = {
    MEDIA: '1',             M: '1',
    PARENT_OF: '1',         P: '1',
    CHILD_OF: '1',          C: '1',
    EXACT: '1',             E: '1',
    THIS: '1',              T: '1',
    INHERITS: {},           I: {},
    STEP: '1',              S: '1',
}

export const pluginList: TPlugin[] = [];
export const pluginAdd = (method: TPlugin, reservedProps: ITSStyle = {}) => {
    pluginList.push(method);
    Object.assign(reservedProperties, reservedProps)
}
