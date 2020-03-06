import '../html/styles/input';
import input from '../html/fast/input';
import { attributes, setAttribs, IAttributesTemplate } from '../utils/attributes'

interface IParameters {
    value: boolean
}

export interface IICheckbox extends HTMLInputElement, IAttributesTemplate<IParameters> {}

export default (attribs?: any) => {
    const root = input('checkbox');

    attributes((root: HTMLInputElement) => ({
        value: {
            set: (value: boolean) => {
                root.checked = value || false;
            },
            get: () => root.checked
        }
    }))(root);

    if (attribs) setAttribs(root, attribs);
    return <IICheckbox> root;
}
