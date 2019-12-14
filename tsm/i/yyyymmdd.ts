import '../../html/styles/input';
import input from '../../html/fast/input';
import { attributes, setAttribs, IAttributesObject } from '../../utils/attributes'
import onvaluechange from '../../on/valuechange';
import { runIfInactive } from '../../utils/debouncers';

import { tDateToString, stringToTDate } from '../../utils/dateTime';

const whileTyping = /^(\d{1,4}([\-](\d{0,2}([\-](\d{1,2})?)?)?)?)?$/;
const whenEntered = /^\d{4}-\d{2}-\d{2}$/;

export default (attribs?: any) => {
    const root = input('date');
    let isRequired: boolean;
    let min = Number.NEGATIVE_INFINITY;
    let max = Number.POSITIVE_INFINITY;

    attributes((root: HTMLInputElement) => ({
        value: {
            set: (value: number) => {
                root.value = tDateToString(value, true, true) || '';
            },
            get: () => stringToTDate(root.value, true, true)
        },
        isValid: {
            get: () => {
                autoCorrect(true);
                const value = stringToTDate(root.value, true, true);
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
        const value = stringToTDate(root.value, true, true);
        if (value !== undefined) root.value = <string>tDateToString(value, true, true);
    }, 1000);

    onvaluechange(() => {
        autoCorrect();
        return whileTyping.test(root.value);
    })(root)


    if (attribs) setAttribs(root, attribs);
    return <IAttributesObject | HTMLInputElement> root;
}