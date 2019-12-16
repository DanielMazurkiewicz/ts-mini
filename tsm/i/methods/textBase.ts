import '../../../html/styles/input';
import input from '../../../html/fast/input';
import { attributes, setAttribs, IAttributesTemplate } from '../../../utils/attributes'
import onvaluechange from '../../../on/valuechange';
import { runIfInactive } from '../../../utils/debouncers';

interface IParameters {
    value: number
    isValid: boolean
    isRequired: boolean
    min: number
}

export interface IIText extends HTMLInputElement, IAttributesTemplate<IParameters> {}

export default (whileTyping: RegExp, whenEntered: RegExp, type?: string, minLength = 0) => (attribs?: any) => {
    const root = input(type);
    let isRequired: boolean;
    let min = minLength;
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
        }
    }))(root);

    const autoCorrect = runIfInactive(() => root.value = root.value.trim(), 1000);

    onvaluechange(() => {
        autoCorrect();
        return whileTyping.test(root.value);
    })(root)

    if (attribs) setAttribs(root, attribs);
    return <IIText> root;
}
