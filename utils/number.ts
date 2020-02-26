export const numberToString = (num: number, decimals = 0, separator = '.'): string | undefined => {
    // @ts-ignore
    if (isNaN(num) || typeof num === 'string') return undefined;
    const str = decimals < 0 ? `${num}` : num.toFixed(decimals);

    const splitted = str.split('.');
    let integerPart = splitted[0];
    let sign = '';
    if (integerPart.startsWith('-')) {
        integerPart = integerPart.substr(1);
        sign = '-'
    }

    const tripplets = [];
    while (integerPart.length) {
        let cutOff = integerPart.length - 3;
        if (cutOff < 0) cutOff = 0;
        tripplets.unshift(integerPart.substr(cutOff));
        integerPart = integerPart.substr(0, cutOff);
    }

    let result =  `${sign}${tripplets.join(' ')}`;
    if (!decimals || !splitted[1]) return result;
    return `${result}${separator}${splitted[1]}`
}

export const stringToNumber = (str: string): number | undefined => {
    const result = parseFloat(str.replace(/\s/g, '').replace(/\,/g, '.'));
    if (isNaN(result)) return undefined;
    return result;

}
