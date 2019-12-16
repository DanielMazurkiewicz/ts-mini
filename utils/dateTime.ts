const fullDaysFactor = 86400000;
export type TDate = number;
export type TDateTime = number;
export type TTime = number;

const date = new Date(0);

export const tDateToDateTime = (input: TDate): TDateTime => input * fullDaysFactor;
export const dateTimeToTDate = (input: TDateTime): TDate => input / fullDaysFactor;

export const Year = 0;
export const Month = 1;
export const Day = 2;
export const Hour = 3;
export const Minute = 4;
export const Second = 5;
export const Milliecond = 6;


export const tDateTimeToString = (input: TDateTime, also = Year): string | undefined => {
    if (isNaN(input)) return undefined;
    date.setTime(input);
    const year = date.getUTCFullYear().toString().padStart(4, '0');
    if (also === Year) return year;
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    if (also === Month) return `${year}-${month}`;
    const day = date.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export const tDateToString = (input: TDate, also?: number): string | undefined => {
    if (isNaN(input)) return undefined;
    return tDateTimeToString(tDateToDateTime(input), also);
}

export const stringToTDateTime = (input: string, expect = Year): TDate | undefined => {
    if (!input) return undefined;
    const splitted = input.split('-').filter(s => s.trim());

    if ((expect === Day) && (splitted.length < 3))
        return undefined;
    else if ((expect === Month) && (splitted.length < 2))
        return undefined;

    const asNumbers = splitted.map(s => parseInt(s));
    if (splitted[0].length < 4) {
        if (asNumbers[0] < 70) {
            asNumbers[0] += 2000;
        } else if (asNumbers[0] < 100) {
            asNumbers[0] += 1900;
        }
    }
    while (asNumbers.length < 3) asNumbers.push(1);
    if (asNumbers[1] < 1 || asNumbers[1] > 12) return undefined;
    if (asNumbers[2] < 1 || asNumbers[2] > 31) return undefined;
    asNumbers[1]--;

    date.setTime(0);
    date.setUTCFullYear(asNumbers[0]);
    date.setUTCMonth(asNumbers[1]);
    date.setUTCDate(asNumbers[2]);
    return date.getTime();
}

export const stringToTDate = (input: string, expect?: number): TDate | undefined => {
    if (!input) return undefined;
    const value = stringToTDateTime(input, expect);
    if (value === undefined) return undefined;
    return dateTimeToTDate(value)
}

export const tTimeToString = (input: TTime, also = Hour, separator = '.'): string | undefined => {
    if (isNaN(input)) return undefined;
    const date = new Date(input);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    let result = `${hours}:${minutes}`;
    if (also === Minute) return result;
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    result += `:${seconds}`;
    if (also === Second) return result;
    const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');
    return `${result}${separator}${milliseconds}`;
}

export const stringToTTime = (input: string, expect = Hour): TTime | undefined => {
    if (!input) return undefined;
    const splitted = input.split(':').filter(s => s.trim());

    if (splitted.length < 2) 
        return undefined;

    if ((expect === Second) && (splitted.length < 3))
        return undefined;

    const asNumbers = splitted.map(s => parseInt(s));

    while (asNumbers.length < 3) asNumbers.push(0);
    if (asNumbers[0] < 0 || asNumbers[0] > 23) return undefined;
    if (asNumbers[1] < 0 || asNumbers[1] > 59) return undefined;
    if (asNumbers[2] < 0 || asNumbers[2] >= 60) return undefined;

    date.setTime(0);
    date.setUTCHours(asNumbers[0]);
    date.setUTCMinutes(asNumbers[1]);
    date.setUTCSeconds(asNumbers[2]);
    return date.getTime();
}
