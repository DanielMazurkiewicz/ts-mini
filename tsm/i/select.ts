import '../../html/styles/select';
import select from '../../html/fast/select';
import { attributes, setAttribs, IAttributesTemplate } from '../../utils/attributes'
import removeChildren from '../../html/methods/removeChildren'

interface IParameters {
    value: string | number
    list: Array<string> | Record<string, string>
    isValid: boolean
    isRequired: boolean
    placeholder: string | undefined
    isNumeric: boolean
}

export interface IISelect extends HTMLSelectElement, IAttributesTemplate<IParameters> {}

export default (attribs?: any) => {
    const root = select();
    let isRequired : boolean
    let isNumeric : boolean
    let placeholder : string
    let list : Array<string> | Record<string, string>

    const refreshList = () => {
        removeChildren(root);

        if (placeholder !== undefined) {
            root.appendChild(new Option(placeholder, ''))
        }

        if (list instanceof Array) {
            list.forEach((e, i) => root.appendChild(new Option(e, <string><unknown>i)))
        } else {
            for (let i in list) {
                root.appendChild(new Option(list[i], i))
            }
        }
    }

    attributes((root: HTMLSelectElement) => ({
        value: {
            set: (value: string | number) => {
                // @ts-ignore
                root.value = value || '';
            },
            get: () => {
                const value = root.value;
                if (value === '') return; // undefined
                if (isNumeric) return parseFloat(value)
                return value;
            }
        },
        list: {
            set: (v: Array<string> | Record<string, string>) => {
                list = v;
                refreshList();
            },
        },
        isValid: {
            get: () => {
                return !isRequired || (isRequired && (root.value !== ''))
            }
        },
        isRequired: {
            set: (v: boolean) => isRequired = v,
            get: () => isRequired
        },
        isNumeric: {
            set: (v: boolean) => isNumeric = v,
        },
        placeholder: {
            set: (v: string) => {
                placeholder = v;
                refreshList();
            }
        },

    }))(root);

    if (attribs) setAttribs(root, attribs);
    return <IISelect> root;
}
