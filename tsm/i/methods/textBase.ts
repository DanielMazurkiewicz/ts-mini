import '../../../html/styles/input';
import input from '../../../html/fast/input';
import { attributes, setAttribs, IAttributesTemplate } from '../../../utils/attributes'
import onvaluechange from '../../../on/valuechange';
import { runIfInactive } from '../../../utils/debouncers';

interface IParameters {
    value: string
    isValid: boolean
    isRequired: boolean
    min: number
    max: number
}

export interface IIText extends HTMLInputElement, IAttributesTemplate<IParameters> {}

export default (whileTyping: RegExp, whenEntered: RegExp, type?: string, minLength = 0) => (attribs?: any) => {
    const root = input(type);
    let isRequired: boolean;
    let min = minLength;
    let max = Number.POSITIVE_INFINITY;
    attributes((root: HTMLInputElement) => ({
        value: {
            set: (value: string) => {
                root.value = value || '';
            },
            get: () => autoCorrect(true) || undefined
        },
        isValid: {
            get: () => {
                autoCorrect(true);
                const value = root.value;
                const length = value.length; 
                return (isRequired === (!length)) &&
                    (length >= min) && 
                    whenEntered.test(value)
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

    const autoCorrect = runIfInactive(() => root.value = root.value.trim(), 1000);

    onvaluechange(() => {
        autoCorrect();
        const value = root.value;
        return (value.length <= max) && whileTyping.test(value);
    })(root)

    if (attribs) setAttribs(root, attribs);
    return <IIText> root;
}
