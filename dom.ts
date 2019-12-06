
import { TsmElement, TsmAnchorElement, TsmAppletElement, TsmAreaElement, TsmAudioElement, TsmBaseElement, TsmBaseFontElement, 
    TsmQuoteElement, TsmBRElement, TsmButtonElement, TsmCanvasElement, TsmTableCaptionElement, TsmTableColElement, 
    TsmDataListElement, TsmModElement, TsmDetailsElement, TsmDivElement, TsmEmbedElement, TsmFieldSetElement, 
    TsmFontElement, TsmFormElement, TsmFrameElement, TsmFrameSetElement, TsmHeadingElement, TsmHeadElement, TsmHRElement, 
    TsmHtmlElement, TsmIFrameElement, TsmImageElement, TsmInputElement, TsmLabelElement, TsmLegendElement, TsmLIElement, 
    TsmLinkElement, TsmMapElement, TsmMenuElement, TsmMetaElement, TsmMeterElement, TsmObjectElement, TsmOListElement, 
    TsmOptGroupElement, TsmOptionElement, TsmOutputElement, TsmParagraphElement, TsmParamElement, TsmPreElement, 
    TsmProgressElement, TsmScriptElement, TsmSelectElement, TsmSourceElement, TsmSpanElement, TsmStyleElement, 
    TsmTableElement, TsmTableSectionElement, TsmTableDataCellElement, TsmTextAreaElement, TsmTableHeaderCellElement, 
    TsmTimeElement, TsmTitleElement, TsmTableRowElement, TsmTrackElement, TsmUListElement, TsmVideoElement, TsmSlotElement, 
    TsmINumber, TsmITel, TsmIEmail, TsmIText, TsmICheckbox, TsmIYyyymmdd, TsmIYyyymm, TsmIHhmm, TsmIArray, 
    TsmIRecord, TsmITextArea, TsmTextPlaceElement, TsmITextPlace, TsmIYyyymmddPlace, TsmIYyyymmPlace, TsmIHhmmPlace, TsmINumberPlace, TsmNode 
} from './DOM/interfaces';

import { TDate, tDateToString, stringToTDate, TTime, tTimeToString, stringToTTime } from './dateTime';
import { stringToNumber, numberToString } from './number';
import { runIfInactive } from './debouncers';

const doc = document;


// =====================================================================================================================

let uniqueId = 0;
export const getUniqueId = () => `_I_${uniqueId++}`

// =====================================================================================================================


export interface IElementOptions {
    [property: string]: any
}



const createElement = (tagName: string) => doc.createElement(tagName);
const createElementWC = (tagName: string, optionsOrChild?: string | Node | TsmElement | IElementOptions, children?: (string | Node)[]):TsmElement => {
    const element = createElement(tagName);
    if (optionsOrChild) {
        if (optionsOrChild instanceof Node){
            element.appendChild(optionsOrChild);
        } else if (optionsOrChild.constructor === String) {
            element.append(<string>optionsOrChild);
        } else {
            setAttribs(element, <IElementOptions>optionsOrChild);
        }
        // @ts-ignore
        element.append(...children);
    
    }
    return element;
}

const createElementWO = (tagName: string, options?: IElementOptions):TsmElement => {
    const element = createElement(tagName);
    setAttribs(element, options);
    return element;
}

// =====================================================================================================================

let componentIndex = 0;
export const component = <T>(definition: Function) => {
    const tagName = 'c-' + (componentIndex++).toString(32);
    customElements.define(tagName, definition);
    return (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => <T><unknown> createElementWC(tagName, optionsOrChild, children);
}
export const cpt = component;

export const setAttribs = (element: HTMLElement, options?: IElementOptions) => {
    if (options) {
        for (let name in options) {
            if (name.startsWith('on')) {
                // @ts-ignore
                element[name] = options[name];
            } else if (name === '$') {
                for (let name in options.$) {
                    // @ts-ignore
                    element[name] = options.$[name];
                }
            } else if (name === 'c') {
                if (options[name] instanceof Array) {
                    element.className = options[name].join(' ');
                } else {
                    element.className = options[name];
                }
            } else {
                element.setAttribute(name, options[name]);
            }
        }
    }
}

export const setAttributes = (element: HTMLElement, options?: IElementOptions) => {
    setAttribs(element, options);
    return element;
}

export const removeChildren = (element: HTMLElement) => {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

export const getChildCausingEvent = (callback: (element: Node | undefined, zones: Node[], evt: Event) => any) => function(this: Node, evt: Event) {
    let current = <Node>evt.target;
    let previous: Node | undefined = current;
    let result: Node | undefined = current;
    let zones: Node[] = [];

    while (current !== null && this !== (current = <Node>current.parentNode)) {
        // @ts-ignore
        if (previous.getAttribute && previous.getAttribute('eventszone')) zones.unshift(previous);
        previous = current;
        result = previous;
    }
    callback(result, zones, evt);
}

// =====================================================================================================================
//
// =====================================================================================================================


export const open = (constrFun: (...args: any[]) => Node, targetElement: HTMLElement, options?: IElementOptions) => {
    const element = constrFun(options);
    targetElement.appendChild(element);
    return element;
}

export const close = (element: Node) => {
    // @ts-ignore
    element.parentNode.removeChild(element)
}

export const show = (element: HTMLElement) => {
    element.style.display = (<any>element).__displayBackup || '';
    delete (<any>element).__displayBackup;
}

export const hide = (element: HTMLElement) => {
    (<any>element).__displayBackup = element.style.display;
    element.style.display = 'none'
}


// =====================================================================================================================
//
// =====================================================================================================================


export const onAnyChange = (element: TsmInputElement, callback:(v: any) => any) => {
    let oldValue: string, oldSelectionStart: number, oldSelectionEnd: number;
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
        element.addEventListener(event, function(this: HTMLInputElement) {
            if (callback(this.value)) {
                oldValue = this.value;
                oldSelectionStart = <number>this.selectionStart;
                oldSelectionEnd = <number>this.selectionEnd;
            } else if (oldValue !== undefined) {
                this.value = oldValue;
                if (this.type !== 'email') { // firefox doesn't work with this for some reason
                    this.setSelectionRange(oldSelectionStart, oldSelectionEnd);
                }
            }
            // TODO: remove that console.log as soon as it will be not necesarry
            // @ts-ignore
            console.log(this, this.type, this.value, this.ivalue)//, (new Date(this.ivalue)).toISOString());
        });
    });
}
  

export const assignIValue = (element: any, setter: (v: any) => void, getter: () => any, name = 'ivalue') => {
    Object.defineProperty(element, name, {
        get: getter,
        set: setter
    });
}

export const getAttributesObserver = (element: HTMLElement) => {
    const attributes: Record<string, (value: string) => void> = {};
    const observer = new MutationObserver(function(mutation) {
        mutation.forEach(m => {
            // @ts-ignore
            if (attributes[m.attributeName]) {
                // @ts-ignore
                attributes[m.attributeName](element.getAttribute(m.attributeName));
            }
        });
    });
    observer.observe(element, {
        attributes: true
    });
   return attributes;
}

// ---------------------------------------------------------------------------------------------------------------------


// while typing validators
const wtvRegexYM =      /^(\d{0,4}([\-](\d{1,2})?)?)?$/;
const wtvRegexYMD =     /^(\d{1,4}([\-](\d{0,2}([\-](\d{1,2})?)?)?)?)?$/;
const wtvRegexHM =      /^(\d{0,2}([\:](\d{1,2})?)?)?$/;
const wtvRegexHMS =     /^(\d{1,2}([\:](\d{1,2}([\:](\d{1,2})?)?)?)?)?$/;
const wtvRegexTel =     /^([+])?(\d+\s){0,5}(\d*)$/;
const wtvRegexEmail =   /^([\w\-\_]+\.)*(([\w\-\_]+)(@(([\w\-\_]+\.)*([\w\-\_]*))?)?)?$/;
const wtvRegexText =    /^(\S+(\s\S+)*\s?)?$/;

const wtvRegexInteger = /^([+-]\s?)?(\d+\s)*(\d*)$/;
const wtvRegexReal =    /^([+-]\s?)?(\d+\s)*(\d*)([\.\,](\d*)?)?$/;
const getWtvRegexNumber = (decimals: number): RegExp => {
    if (decimals < 0) return wtvRegexReal;
    if (decimals === 0) return wtvRegexInteger;
    return new RegExp(`^([+-]\s?)?(\\d+\\s)*(\\d*)([\\.\\,](\\d{0,${decimals}})?)?$`);
}


// when entered validators:
const wevRegexYM =       /^\d{4}-\d{2}$/;
const wevRegexYMD =      /^\d{4}-\d{2}-\d{2}$/;
const wevRegexHM =       /^\d{2}:\d{2}$/;
const wevRegexHMS =      /^\d{2}:\d{2}:\d{2}$/;
const wevRegexHMSM =     /^\d{2}:\d{2}:\d{2}[\.\,]\d{3}$/;
const wevRegexTel =      /^([+])?(\d+\s){0,5}(\d+)$/;
// const wevRegexEmail =    /^([\w\-\_]+\.)*([\w\-\_]+)@{1}([\w\-\_]+\.)+([\w\-\_]{2,})$/
const wevRegexEmail =    /^((\w|[-_])+\.)*((\w|[-_])+)@((\w|[-_])+\.)+((\w|[-_]){2,})$/;
const wevRegexText =     /^\S+(\s\S+)*$/;
const wevRegexPassword = /^.{6,}$/;


const getWevRegexNumber = (decimals: number): RegExp => {
    if (decimals === 0) return /^([+-])?((\d+\s)*\d+)+$/
    return /^([+-])?((\d+\s)*\d+)+([\.,]\d+)?$/
}


const isRequired = (element: any) => element.irequire || (element.getAttribute && (element.getAttribute('require') || element.getAttribute('required'))) 

const createInputElement = (type: string = 'text') => {
    const input = <TsmInputElement>createElement('input');
    input.setAttribute('type', type)
    return input;
}

const setIsNotValidFunction = (input: any, regex: RegExp, correctionCallback?: () => void) => {
    input.iIsNotValid = () => {
        correctionCallback && correctionCallback();
        if (isRequired(input)) {
            if (input.value === '') return 1;
            if (!regex.test(input.value)) return 2;
        } else if (input.value !== '' && !regex.test(input.value)) {
            return 2;
        }
    }
}

// ---------------------------------------------------------------------------------------------------------------------

export const iyyyymmdd = (options?: IElementOptions) => {
    const input = createInputElement('date');
    setIsNotValidFunction(input, wevRegexYMD, () => correctValue(true));

    assignIValue(input, function(this: HTMLInputElement, value: TDate) {
        this.value = tDateToString(value, true, true) || '';
    }, function(this: HTMLInputElement){
        return stringToTDate(this.value, true, true);
    });

    if (options) setAttribs(input, options);

    const correctValue = runIfInactive(() => {
        const value = stringToTDate(input.value, true, true);
        if (value !== undefined) input.value = <string>tDateToString(value, true, true);
    }, 1000);

    onAnyChange(input, (v) => {
        correctValue();
        return wtvRegexYMD.test(v);
    });

    return <TsmIYyyymmdd>input;
}

export const iyyyymm = (options?: IElementOptions) => {
    const input = createInputElement('month');
    setIsNotValidFunction(input, wevRegexYM, () => correctValue(true));

    assignIValue(input, function(this: HTMLInputElement, value: TDate) {
        this.value = tDateToString(value, true) || '';
    }, function(this: HTMLInputElement) {
        return stringToTDate(this.value, true);
    });

    if (options) setAttribs(input, options);

    const correctValue = runIfInactive(() => {
        const value = stringToTDate(input.value, true);
        if (value !== undefined) input.value = <string>tDateToString(value, true);
    }, 1000);

    onAnyChange(input, (v) => {
        correctValue();
        return wtvRegexYM.test(v);
    });

    return <TsmIYyyymm>input;
}

export const ihhmm = (options?: IElementOptions) => {
    const input = createInputElement();
    setIsNotValidFunction(input, wevRegexHM, () => correctValue(true));

    assignIValue(input, function(this: HTMLInputElement, value: TTime) {
        this.value = <string>tTimeToString(value) || '';
    }, function(this: HTMLInputElement){
        return stringToTTime(this.value);
    });

    if (options) setAttribs(input, options);

    const correctValue = runIfInactive(() => {
        const value = stringToTTime(input.value);
        if (value !== undefined) input.value = <string>tTimeToString(value);
    }, 1000);

    onAnyChange(input, (v) => {
        correctValue();
        return wtvRegexHM.test(v);
    });

    return <TsmIHhmm>input;
}

export const inumber = (options?: IElementOptions) => {
    const input = createInputElement();
    
    assignIValue(input, function(this: HTMLInputElement, value: number) {
        this.value = numberToString(value, decimals) || '';
    }, function(this: HTMLInputElement){
        return stringToNumber(this.value);
    });

    let decimals = -1000000;
    let wevRegexNumber: RegExp;
    let wtvRegexNumber: RegExp;

    const setDecimals = () => {
        wevRegexNumber = getWevRegexNumber(decimals);
        wtvRegexNumber = getWtvRegexNumber(decimals);
        setIsNotValidFunction(input, wevRegexNumber, () => correctValue(true));
    }

    const ao = getAttributesObserver(input);
    ao.decimals = (value) => {
        decimals = parseInt(value);
        if (isNaN(decimals)) decimals = -1;
        setDecimals();
        correctValue(true); // force immediate correction
    }

    if (options) {
        setAttribs(input, options);
    }

    if (decimals <= -1000000) {
        decimals = -1;
    }
    setDecimals();

    const correctValue = runIfInactive(() => {
        const value = stringToNumber(input.value);
        if (value !== undefined) input.value = <string>numberToString(value, decimals);
    }, 1000);

    onAnyChange(input, (v) => {
        correctValue();
        return wtvRegexNumber.test(v);
    });

    return <TsmINumber>input;
}

export const itel = (options?: IElementOptions) => {
    const input = createInputElement('tel');
    setIsNotValidFunction(input, wevRegexTel, () => correctValue(true));

    assignIValue(input, function(this: HTMLInputElement, value: string) {
        this.value = value || '';
    }, function(this: HTMLInputElement){
        return this.value.trim();
    });

    if (options) setAttribs(input, options);

    const correctValue = runIfInactive(() => {
        input.value = input.value.trim();
    }, 1000);

    onAnyChange(input, (v) => {
        correctValue();
        return wtvRegexTel.test(v);
    });

    return <TsmITel>input;
}

export const iemail = (options?: IElementOptions) => {
    const input = createInputElement('email');
    setIsNotValidFunction(input, wevRegexEmail);

    assignIValue(input, function(this: HTMLInputElement, value: string) {
        this.value = value || '';
    }, function(this: HTMLInputElement){
        return this.value;
    });

    if (options) setAttribs(input, options);

    onAnyChange(input, (v) => {
        return wtvRegexEmail.test(v);
    });

    return <TsmIEmail>input;
}

export const itext = (options?: IElementOptions) => {
    const input = createInputElement();
    setIsNotValidFunction(input, wevRegexText, () => correctValue(true));

    assignIValue(input, function(this: HTMLInputElement, value: string) {
        this.value = value || '';
    }, function(this: HTMLInputElement){
        return this.value.trim();
    });

    if (options) setAttribs(input, options);

    const correctValue = runIfInactive(() => {
        input.value = input.value.trim();
    }, 1000);

    onAnyChange(input, (v) => {
        correctValue();
        return wtvRegexText.test(v);
    });

    return <TsmIText>input;
}

export const ipassword = (options?: IElementOptions) => {
    const input = createInputElement('password');
    setIsNotValidFunction(input, wevRegexPassword);

    assignIValue(input, function(this: HTMLInputElement, value: string) {
        this.value = value || '';
    }, function(this: HTMLInputElement){
        return this.value;
    });

    if (options) setAttribs(input, options);

    return <TsmIText>input;
}

export const itextarea = (options?: IElementOptions) => {
    const input = textarea(options);

    assignIValue(input, function(this: HTMLTextAreaElement, value: string) {
        this.value = value || '';
    }, function(this: HTMLTextAreaElement){
        return this.value;
    });

    if (options) setAttribs(input, options);

    return <TsmITextArea>input;
}

export const icheckbox = (options?: IElementOptions) => {
    const input = createInputElement('checkbox');

    assignIValue(input, function(this: HTMLInputElement, value: boolean) {
        this.checked = value;
    }, function(this: HTMLInputElement){
        return this.checked;
    });

    if (options) setAttribs(input, options);

    return <TsmICheckbox>input;
}


const setKeyAndValueOfTsmElement = (el: TsmElement, v: any, k: any, keyDest: string, valueFrom?: string, keyFrom?: string, valueDest?: string) => {
    if (valueFrom !== undefined) {
        // @ts-ignore
        el[valueDest] = v[valueFrom]
    } else {
        // @ts-ignore
        el[valueDest] = v;
    }

    if (keyFrom !== undefined) {
        el.setAttribute(keyDest, v[keyFrom]);
    } else {
        el.setAttribute(keyDest, k);
    }
}

const getValueOfTsmElement = (el: TsmElement, valueDest = 'ivalue') => {
    // @ts-ignore
    return el[valueDest];
}


export interface IDecoratorOptions {
    decorator: () => TsmElement,
    rootElement?: () => TsmElement,
    options?: IElementOptions,
}

export interface IElementOptionsForDecorator extends IElementOptions {
    keyFrom?: string,           // if defined, then instead of using index, a specific object property will be used as key
    keyDest?: string,           // defines how element keys will be named and visible to DOM   

    valueFrom?: string,         // if defined, then instead of using directly array value, it uses value from given property
    valueDest?: string,         // property that should be assigned a value

    availableAs?: string,       // defines property name under which all values will be available

    recycle?: boolean,          // reuses existing dom elements to draw new values
}

export const iarray = (decoratorOptions: IDecoratorOptions, options: IElementOptionsForDecorator = {}) => {
    const input = decoratorOptions.rootElement ? decoratorOptions.rootElement() : <TsmElement>createElement('div');

    let {decorator, options: decorOptions} = decoratorOptions;
    let {keyDest, keyFrom, valueFrom, recycle, valueDest, availableAs} = options;

    keyDest = keyDest || 'ikey';
    valueDest = valueDest || 'ivalue';


    const getDecoratorElement = (v: any, k: any) => {
        const el = decorator();
        if (decorOptions) setAttribs(el, decorOptions);
        setKeyAndValueOfTsmElement(el, v, k, <string>keyDest, valueFrom, keyFrom, valueDest);
        return el;
    }

    assignIValue(input, function(arr: any[]) {
        if (recycle) {
            while (arr.length < input.children.length) {
                input.removeChild(<Node>input.lastChild);
            }

            const ivalueReassignLength = input.children.length;
            const toAppend: TsmElement[] = [];
            for (let i = ivalueReassignLength; arr.length > i; i++) {
                toAppend.push(getDecoratorElement(arr[i], i));
            }
            input.append(...toAppend);
            for (let i = 0; i < ivalueReassignLength; i++) {
                setKeyAndValueOfTsmElement(<TsmElement>input.children[i], arr[i], i, <string>keyDest, valueFrom, keyFrom);
            }
        } else {
            removeChildren(input);
            input.append(...arr.map((v, k) => getDecoratorElement(v, k)));
        }
    }, function(){
        const result = [];
        const children = input.children;
        for (let i = 0; i < children.length; i++) {
            result[i] = getValueOfTsmElement(<TsmElement>children[i], valueDest);
        }
        return result;
    }, availableAs);

    // @ts-ignore
    input.iadd = (v: any) => {
        input.appendChild(getDecoratorElement(v, input.children.length));
    }

    if (options) setAttribs(input, options);
    return <TsmIArray>input;
}

export const irecord = (decoratorOptions: IDecoratorOptions, options: IElementOptionsForDecorator = {}) => {
    const input = decoratorOptions.rootElement ? decoratorOptions.rootElement() : <TsmElement>createElement('div');

    let {decorator, options: decorOptions} = decoratorOptions;
    let {keyDest, keyFrom, valueFrom, recycle, valueDest, availableAs} = options;

    keyDest = keyDest || 'ikey';
    valueDest = valueDest || 'ivalue';

    const getDecoratorElement = (v: any, k: any) => {
        const el = decorator();
        if (decorOptions) setAttribs(el, decorOptions);
        setKeyAndValueOfTsmElement(el, v, k, <string>keyDest, valueFrom, keyFrom, valueDest);
        return el;
    }

    assignIValue(input, function(record: Record<any, any>) {
        if (recycle) {
            let index = 0;
            for (let name in record) {
                if (index >= input.children.length) {
                    input.appendChild(getDecoratorElement(record[name], name));
                } else {
                    setKeyAndValueOfTsmElement(<TsmElement>input.children[index], record[name], name, <string>keyDest, valueFrom, keyFrom);
                }
                index++;
            }
            while (index < input.children.length) {
                input.removeChild(<Node>input.lastChild);
            }
        } else {
            removeChildren(input);
            for (let name in record) {
                input.appendChild(getDecoratorElement(record[name], name));
            }
        }
    }, function(){
        const result: Record<any, any> = {};
        const children = input.children;
        for (let i = 0; i < children.length; i++) {
            let key: any;
            let value = getValueOfTsmElement(<TsmElement>children[i], valueDest);
            if (keyFrom !== undefined) {
                key = value[keyFrom];
            } else {
                key = children[i].getAttribute(<string>keyDest);
            }

            result[key] = value;
        }
        return result;
    }, availableAs);

    // @ts-ignore
    input.iadd = (v: any, k?: any) => {
        input.appendChild(getDecoratorElement(v, k));
    }

    if (options) setAttribs(input, options);
    return <TsmIRecord>input;
}

export interface IElementOptionsForISwitch extends IElementOptions {
    keyFrom?: string,           // if defined, then instead of using index, a specific object property will be used as key
    keyDest?: string,           // defines how element keys will be named and visible to DOM
    keyIfUnrecognized?: string     // key that will be used when there is no case

    valueApply?: boolean,       // Assign value to element that is currently switched

    valueFrom?: string,         // if defined, then instead of using directly array value, it uses value from given property
    valueDest?: string,         // property that should be assigned a value

    availableAs?: string,       // defines property name under which all values will be available
}
export interface ISwitchCases {
    [name: string]: (...arg: any[]) => TsmElement | TsmElement;
}
export const iswitch = (cases: ISwitchCases, options: IElementOptionsForISwitch = {}, input = <TsmElement>createElement('div')) => {

    let {keyDest, keyFrom, valueApply, valueFrom, keyIfUnrecognized, valueDest, availableAs} = options;

    keyDest = keyDest || 'ikey';
    valueDest = valueDest || 'ivalue';

    let value: any;
    let element: TsmElement;
    assignIValue(input, function(v: any) {
        value = v;
        let key;
        if (keyFrom !== undefined) {
            key = v[keyFrom];
        } else {
            key = v;
        }
        input.setAttribute(<string>keyDest, key)

        if (input.lastChild) input.removeChild(input.lastChild);

        let elementCase = cases[v];
        if (!elementCase && keyIfUnrecognized) elementCase = cases[keyIfUnrecognized];

        if (elementCase) {
            if (elementCase instanceof Node) {
                // @ts-ignore
                element = elementCase;
                input.appendChild(elementCase)
            } else if (typeof elementCase === 'function') {
                input.appendChild(element = elementCase());
            }

            if (valueApply) {
                if (valueFrom !== undefined) {
                    // @ts-ignore
                    element[valueDest] = v[valueFrom];
                } else {
                    // @ts-ignore
                    element[valueDest] = v;
                }
            }
        }
    }, function() {
        if (valueApply) {
            if (valueFrom !== undefined) {
                // @ts-ignore
                return Object.assign({}, value, {[valueFrom]: element[valueDest]});
            } else {
                // @ts-ignore
                return element[valueDest];
            }
        }
        return value;
    }, availableAs);

    // // @ts-ignore
    // input.iadd = (v: any, k?: any) => {
    // }

    if (options) setAttribs(input, options);
    return <TsmIRecord>input;
}

export const ioption = (options?: IElementOptions) => {
    const input = option();
    assignIValue(input, function(this: HTMLOptionElement, value: string) {
        this.value = value || '';
    }, function(this: HTMLOptionElement){
        return this.value;
    });
    if (options) setAttribs(input, options);
    return input;
}

export interface IElementOptionsForISelect extends IElementOptions {
    isNumeric?: boolean
}
export const iselect = (options: IElementOptionsForISelect = {}, dataManager: (...param: any[]) => TsmIArray | TsmIRecord) => {
    const input = dataManager({decorator: option, rootElement: select}, Object.assign({keyDest: 'value', valueDest: 'innerText', availableAs: 'ivalues'}, options));
    const { isNumeric } = options;
    assignIValue(input, function(this: HTMLSelectElement, value: string) {
        this.value = value;
    }, function(this: HTMLSelectElement){
        if (isNumeric) {
            const result = parseFloat(this.value);
            if (!isNaN(result)) return result;
        } else {
            return this.value;
        }
    });
    if (options) setAttribs(input, options);
    return input;
}


// =====================================================================================================================


export const setIValues = (destinationRecord: any, source: any) => {
    for (let name in destinationRecord) {
        destinationRecord[name].ivalue = source[name];
    }
    return source;
}

export const getIValues = (sourceRecord: any, resultBase: Record<any, any> = {}) => {
    for (let name in sourceRecord) {
        resultBase[name] = sourceRecord[name].ivalue;
    }
    return resultBase;
}

export const areIValuesNotValid = (sourceRecord: any, callback?: (isNotValid: any, name: string, element: TsmElement | TsmNode) => void) => {
    const result: String[] = [];
    for (let name in sourceRecord) {
        const element = sourceRecord[name];
        const isNotValid = element.iIsNotValid && element.iIsNotValid();
        if (isNotValid)
            result.push(name);

        callback && callback(isNotValid, name, element);
    }
    if (result.length) return result;
}

// =====================================================================================================================


export const itextplace = (options?: IElementOptions) => {
    const input = textplace();

    let v: string;
    assignIValue(input, function(this: Text, value: string) {
        v = value;
        this.textContent = v || '';
    }, function(){
        return v;
    });

    if (options && options.$ && options.$.ivalue !== undefined) input.ivalue = options.$.ivalue;

    return <TsmITextPlace>input;
}
export const itextareaplace = itextplace;
export const itelplace = itextplace;
export const iemailplace = itextplace;


export const iyyyymmddplace = (options?: IElementOptions) => {
    const input = textplace();
    let v: TDate;
    assignIValue(input, function(this: Text, value: TDate) {
        v = value;
        this.textContent = tDateToString(value, true, true) || '';
    }, function() {
        return v;
    });

    if (options && options.$ && options.$.ivalue !== undefined) input.ivalue = options.$.ivalue;

    return <TsmIYyyymmddPlace>input;
}

export const iyyyymmplace = (options?: IElementOptions) => {
    const input = textplace();

    let v: TDate;
    assignIValue(input, function(this: Text, value: TDate) {
        v = value;
        this.textContent = tDateToString(value, true) || '';
    }, function() {
        return v;
    });

    if (options && options.$ && options.$.ivalue !== undefined) input.ivalue = options.$.ivalue;

    return <TsmIYyyymmPlace>input;
}


export const ihhmmplace = (options?: IElementOptions) => {
    const input = textplace();

    let v: TTime;
    assignIValue(input, function(this: Text, value: TTime) {
        v = value;
        this.textContent = tTimeToString(value) || '';
    }, function(){
        return v;
    });

    if (options && options.$ && options.$.ivalue !== undefined) input.ivalue = options.$.ivalue;

    return <TsmIHhmmPlace>input;
}

export const inumberplace = (options?: IElementOptions) => {
    const input = textplace();

    let v: TTime;
    assignIValue(input, function(this: Text, value: TTime) {
        v = value;
        this.textContent = numberToString(value, decimals) || '';
    }, function(){
        return v;
    });
    let decimals = (options && (options.decimals !== undefined)) ? options.decimals : -1;
    if (options && options.$ && options.$.ivalue !== undefined) input.ivalue = options.$.ivalue;

    return <TsmINumberPlace>input;
}


// =====================================================================================================================
//
// =====================================================================================================================


export const shadow = (t: TsmElement, ...children: (string | Node)[]) => {
    const sh = t.attachShadow({mode: 'open'});
    sh.append(...children);
    return sh;
}
export const body = (...children: (string | Node)[]) => doc.body.append(...children)
export const textplace = (txt = '') => <TsmTextPlaceElement>doc.createTextNode(txt);

// =====================================================================================================================


export const a = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmAnchorElement>createElementWC('a', optionsOrChild, children);


export const abbr = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('abbr', optionsOrChild, children);


export const acronym = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('acronym', optionsOrChild, children);


export const address = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('address', optionsOrChild, children);


export const applet = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmAppletElement>createElementWC('applet', optionsOrChild, children);


export const area = (options?: object) => 
    <TsmAreaElement>createElementWO('area', options);
    

export const article = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('article', optionsOrChild, children);


export const aside = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('aside', optionsOrChild, children);


export const audio = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmAudioElement>createElementWC('audio', optionsOrChild, children);


export const b = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('b', optionsOrChild, children);


export const base = (options?: object) => 
    <TsmBaseElement>createElementWO('base', options);
    

export const basefont = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmBaseFontElement>createElementWC('basefont', optionsOrChild, children);


export const bdi = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('bdi', optionsOrChild, children);


export const bdo = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('bdo', optionsOrChild, children);


export const big = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('big', optionsOrChild, children);


export const blockquote = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmQuoteElement>createElementWC('blockquote', optionsOrChild, children);


export const br = (options?: object) => 
    <TsmBRElement>createElementWO('br', options);
    

export const button = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmButtonElement>createElementWC('button', optionsOrChild, children);


export const canvas = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmCanvasElement>createElementWC('canvas', optionsOrChild, children);


export const caption = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmTableCaptionElement>createElementWC('caption', optionsOrChild, children);


export const center = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('center', optionsOrChild, children);


export const cite = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('cite', optionsOrChild, children);


export const code = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('code', optionsOrChild, children);


export const col = (options?: object) => 
    <TsmTableColElement>createElementWO('col', options);
    

export const colgroup = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmTableColElement>createElementWC('colgroup', optionsOrChild, children);


export const command = (options?: object) => 
    createElementWO('command', options);
    

export const datalist = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmDataListElement>createElementWC('datalist', optionsOrChild, children);


export const dd = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('dd', optionsOrChild, children);


export const del = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmModElement>createElementWC('del', optionsOrChild, children);


export const details = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmDetailsElement>createElementWC('details', optionsOrChild, children);


export const dfn = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('dfn', optionsOrChild, children);


export const dir = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('dir', optionsOrChild, children);


export const div = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmDivElement>createElementWC('div', optionsOrChild, children);


export const dl = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('dl', optionsOrChild, children);


export const dt = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('dt', optionsOrChild, children);


export const em = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('em', optionsOrChild, children);


export const embed = (options?: object) => 
    <TsmEmbedElement>createElementWO('embed', options);
    

export const fieldset = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmFieldSetElement>createElementWC('fieldset', optionsOrChild, children);


export const figcaption = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('figcaption', optionsOrChild, children);


export const figure = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('figure', optionsOrChild, children);


export const font = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmFontElement>createElementWC('font', optionsOrChild, children);


export const footer = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('footer', optionsOrChild, children);


export const form = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmFormElement>createElementWC('form', optionsOrChild, children);


export const frame = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmFrameElement>createElementWC('frame', optionsOrChild, children);


export const frameset = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmFrameSetElement>createElementWC('frameset', optionsOrChild, children);


export const h1 = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmHeadingElement>createElementWC('h1', optionsOrChild, children);


export const h6 = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmHeadingElement>createElementWC('h6', optionsOrChild, children);


export const head = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmHeadElement>createElementWC('head', optionsOrChild, children);


export const header = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('header', optionsOrChild, children);


export const hgroup = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('hgroup', optionsOrChild, children);


export const hr = (options?: object) => 
    <TsmHRElement>createElementWO('hr', options);
    

export const Tsm = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmHtmlElement>createElementWC('Tsm', optionsOrChild, children);


export const i = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('i', optionsOrChild, children);


export const iframe = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmIFrameElement>createElementWC('iframe', optionsOrChild, children);


export const img = (options?: object) => 
    <TsmImageElement>createElementWO('img', options);
    

export const input = (options?: object) => 
    <TsmInputElement>createElementWO('input', options);
    

export const ins = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('ins', optionsOrChild, children);


export const kbd = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('kbd', optionsOrChild, children);


export const keygen = (options?: object) => 
    createElementWO('keygen', options);
    

export const label = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmLabelElement>createElementWC('label', optionsOrChild, children);


export const legend = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmLegendElement>createElementWC('legend', optionsOrChild, children);


export const li = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmLIElement>createElementWC('li', optionsOrChild, children);


export const link = (options?: object) => 
    <TsmLinkElement>createElementWO('link', options);
    

export const map = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmMapElement>createElementWC('map', optionsOrChild, children);


export const mark = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('mark', optionsOrChild, children);


export const menu = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmMenuElement>createElementWC('menu', optionsOrChild, children);


export const meta = (options?: object) => 
    <TsmMetaElement>createElementWO('meta', options);
    

export const meter = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmMeterElement>createElementWC('meter', optionsOrChild, children);


export const nav = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('nav', optionsOrChild, children);


export const noframes = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('noframes', optionsOrChild, children);


export const noscript = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('noscript', optionsOrChild, children);


export const object = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmObjectElement>createElementWC('object', optionsOrChild, children);


export const ol = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmOListElement>createElementWC('ol', optionsOrChild, children);


export const optgroup = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmOptGroupElement>createElementWC('optgroup', optionsOrChild, children);


export const option = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmOptionElement>createElementWC('option', optionsOrChild, children);


export const output = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmOutputElement>createElementWC('output', optionsOrChild, children);


export const p = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmParagraphElement>createElementWC('p', optionsOrChild, children);


export const param = (options?: object) => 
    <TsmParamElement>createElementWO('param', options);
    

export const pre = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmPreElement>createElementWC('pre', optionsOrChild, children);


export const progress = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmProgressElement>createElementWC('progress', optionsOrChild, children);


export const q = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmQuoteElement>createElementWC('q', optionsOrChild, children);


export const rp = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('rp', optionsOrChild, children);


export const rt = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('rt', optionsOrChild, children);


export const ruby = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('ruby', optionsOrChild, children);


export const s = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('s', optionsOrChild, children);


export const samp = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('samp', optionsOrChild, children);


export const script = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmScriptElement>createElementWC('script', optionsOrChild, children);


export const section = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('section', optionsOrChild, children);


export const select = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmSelectElement>createElementWC('select', optionsOrChild, children);


export const small = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('small', optionsOrChild, children);


export const source = (options?: object) => 
    <TsmSourceElement>createElementWO('source', options);
    

export const span = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmSpanElement>createElementWC('span', optionsOrChild, children);


export const strike = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('strike', optionsOrChild, children);


export const strong = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('strong', optionsOrChild, children);


export const style = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmStyleElement>createElementWC('style', optionsOrChild, children);


export const sub = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('sub', optionsOrChild, children);


export const summary = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('summary', optionsOrChild, children);


export const sup = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('sup', optionsOrChild, children);


export const table = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmTableElement>createElementWC('table', optionsOrChild, children);


export const tbody = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmTableSectionElement>createElementWC('tbody', optionsOrChild, children);


export const td = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmTableDataCellElement>createElementWC('td', optionsOrChild, children);


export const textarea = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmTextAreaElement>createElementWC('textarea', optionsOrChild, children);


export const tfoot = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmTableSectionElement>createElementWC('tfoot', optionsOrChild, children);


export const th = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmTableHeaderCellElement>createElementWC('th', optionsOrChild, children);


export const thead = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmTableSectionElement>createElementWC('thead', optionsOrChild, children);


export const time = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmTimeElement>createElementWC('time', optionsOrChild, children);


export const title = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmTitleElement>createElementWC('title', optionsOrChild, children);


export const tr = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmTableRowElement>createElementWC('tr', optionsOrChild, children);


export const track = (options?: object) => 
    <TsmTrackElement>createElementWO('track', options);
    

export const tt = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('tt', optionsOrChild, children);


export const u = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('u', optionsOrChild, children);


export const ul = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmUListElement>createElementWC('ul', optionsOrChild, children);


export const variable = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    createElementWC('var', optionsOrChild, children);


export const video = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmVideoElement>createElementWC('video', optionsOrChild, children);


export const wbr = (options?: object) => 
    createElementWO('wbr', options);
    

export const h2 = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmHeadingElement>createElementWC('h2', optionsOrChild, children);


export const h3 = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmHeadingElement>createElementWC('h3', optionsOrChild, children);


export const h4 = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmHeadingElement>createElementWC('h4', optionsOrChild, children);


export const h5 = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmHeadingElement>createElementWC('h5', optionsOrChild, children);


export const menuitem = (options?: object) => 
    createElementWO('menuitem', options);
    

export const slot = (optionsOrChild?: string | Node | TsmElement | IElementOptions, ...children: (string | Node)[]) => 
    <TsmSlotElement>createElementWC('slot', optionsOrChild, children);

