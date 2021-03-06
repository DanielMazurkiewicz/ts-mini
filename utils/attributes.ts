import throwError from "./throwError";
import { ERROR_ATTRIBUTES_REQUIRED } from "../ERRORS";

export const getAttributeDescriptor = (element: any, name: string) => element.$ && Object.getOwnPropertyDescriptor(element.$, name)

export const setAttribs = (element: any, attribs: Record<string, any>) => {
    if (!attribs) throwError(ERROR_ATTRIBUTES_REQUIRED);

    for (let name in attribs) {
        const value = attribs[name];
        if (getAttributeDescriptor(element, name)) {
            element.$[name] = value;
        } else {
            if (value === null) {
                element.removeAttribute(name);
            } else {
                element.setAttribute(name, value);
            }
        }
    }
    return element;
}

export interface IAttributesTemplate <AttributesDefinition> {
    $: AttributesDefinition
}
export type IAttributesObject = IAttributesTemplate<Record<string, any>>



export const getAttributes = (element: any) => <Record<string, any>> element.$;

export const attributes = (callback: (element: any) => Record<string, (PropertyDescriptor & ThisType<any>) | Function>) => {
    return (element: any) => {
        let attributeDescriptors = element.$; 
        if (!attributeDescriptors) attributeDescriptors = element.$ = {};
        const newAttributes = callback(element);
        for (let name in newAttributes) {
            const attribute = newAttributes[name];
            if (typeof attribute === 'function') {
                attributeDescriptors[name] = attribute;
            } else {
                Object.defineProperty(attributeDescriptors, name, attribute);
            }
        }
    }
}
