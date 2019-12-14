import '../../html/styles/input';
import input from '../../html/fast/input';
import { attributes, setAttribs, IAttributesObject } from '../../utils/attributes'
import onvaluechange from '../../on/valuechange';
import { runIfInactive } from '../../utils/debouncers';
import { numberToString, stringToNumber } from '../../utils/number';




const wtvRegexInteger = /^([+-]\s?)?(\d+\s)*(\d*)$/;
const wtvRegexReal =    /^([+-]\s?)?(\d+\s)*(\d*)([\.\,](\d*)?)?$/;
const getWhileTyping = (decimals: number): RegExp => {
    if (decimals < 0) return wtvRegexReal;
    if (decimals === 0) return wtvRegexInteger;
    return new RegExp(`^([+-]\s?)?(\\d+\\s)*(\\d*)([\\.\\,](\\d{0,${decimals}})?)?$`);
}

const getWhenEntered = (decimals: number): RegExp => {
    if (decimals === 0) return /^([+-])?((\d+\s)*\d+)+$/
    return /^([+-])?((\d+\s)*\d+)+([\.,]\d+)?$/
}

export default (attribs?: any) => {
    const root = input();
    let isRequired: boolean;
    let min = Number.NEGATIVE_INFINITY;
    let max = Number.POSITIVE_INFINITY;

    let whileTyping: RegExp;
    let whenEntered: RegExp;
    let decimals: number;

    const setDecimals = (d: number) => {
        whenEntered = getWhenEntered(d);
        whileTyping = getWhileTyping(d);
        decimals = d;
    }

    setDecimals(-1000000)

    attributes((root: HTMLInputElement) => ({
        value: {
            set: (value: number) => {
                root.value = numberToString(value, decimals) || '';
            },
            get: () => stringToNumber(root.value)
        },
        isValid: {
            get: () => {
                autoCorrect(true);
                const value = stringToNumber(root.value);
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
        },
        decimals: {
            set: setDecimals
        }
    }))(root);

    const autoCorrect = runIfInactive(() => {
        const value = stringToNumber(root.value);
        if (value !== undefined) root.value = <string>numberToString(value, decimals);
    }, 1000);

    onvaluechange(() => {
        autoCorrect();
        return whileTyping.test(root.value);
    })(root)


    if (attribs) setAttribs(root, attribs);
    return <IAttributesObject | HTMLInputElement> root;
}