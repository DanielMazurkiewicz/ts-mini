import '../html/styles/textarea';
import textarea from '../html/fast/textarea';
import { attributes, setAttribs, IAttributesTemplate } from '../utils/attributes'
import onvaluechange from '../on/valuechange';
import { runIfInactive } from '../utils/debouncers';

interface IParameters {
    value: number
    isValid: boolean
    isRequired: boolean
    min: number
    max: number
}

export interface IIEditor extends HTMLTextAreaElement, IAttributesTemplate<IParameters> {}

export default (attribs?: any) => {
    const root = textarea();
    let isRequired: boolean;
    let min = 0;
    let max = Number.POSITIVE_INFINITY;
    attributes((root: HTMLInputElement) => ({
        value: {
            set: (value: string) => {
                root.value = value || '';
            },
            get: () => root.value || undefined
        },
        isValid: {
            get: () => {
                const value = root.value;
                const length = value.length; 
                return (isRequired === (!length)) &&
                    (length >= min) && (length <= max)
            }
        },
        isRequired: {
            set: (v: boolean) => isRequired = v,
            get: () => isRequired
        },
        min: {
            set: (v: number) => min = v
        },
        max: {
            set: (v: number) => max = v
        }
    }))(root);

    onvaluechange(() => {
        const value = root.value;
        return (value.length <= max);
    })(root)

    if (attribs) setAttribs(root, attribs);
    return <IIEditor> root;
}
