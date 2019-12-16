import '../../../html/styles/input';
import input from '../../../html/fast/input';
import { attributes, setAttribs, IAttributesTemplate } from '../../../utils/attributes'
import onvaluechange from '../../../on/valuechange';
import { runIfInactive } from '../../../utils/debouncers';

import { tDateToString, stringToTDate } from '../../../utils/dateTime';

interface IParameters {
    value: number
    isValid: boolean
    isRequired: boolean
    min: number
    max: number
}

export interface IIDate extends HTMLInputElement, IAttributesTemplate<IParameters> {}

export default (whileTyping: RegExp, whenEntered: RegExp, detailsLevel: number) => (attribs?: any) => {
    const root = input();
    let isRequired: boolean;
    let min = Number.NEGATIVE_INFINITY;
    let max = Number.POSITIVE_INFINITY;

    attributes((root: HTMLInputElement) => ({
        value: {
            set: (value: number) => {
                root.value = tDateToString(value, detailsLevel) || '';
            },
            get: () => stringToTDate(root.value, detailsLevel)
        },
        isValid: {
            get: () => {
                autoCorrect(true);
                const value = stringToTDate(root.value, detailsLevel);
                return (isRequired === (value !== undefined)) &&
                    (<number>value >= min) && 
                    (<number>value <= max) && 
                    whenEntered.test(root.value)
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

    const autoCorrect = runIfInactive(() => {
        const value = stringToTDate(root.value, detailsLevel);
        if (value !== undefined) root.value = <string>tDateToString(value, detailsLevel);
    }, 1000);

    onvaluechange(() => {
        autoCorrect();
        return whileTyping.test(root.value);
    })(root)


    if (attribs) setAttribs(root, attribs);
    return <IIDate> root;
}