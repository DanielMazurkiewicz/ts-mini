import { IProperties } from '../tss/properties'
import { runIfInactive } from '../utils/debouncers';

interface IOptions {
    MEDIA?: string;
    SELECTOR?: string | string[];
}

export interface ITSStyleStrict extends IProperties, IOptions {
}

export interface ITSStyle extends ITSStyleStrict {
    [property: string]: string | string[] | undefined; // except defined it also accepts undefined properties;
}



let keyframeIndex = 0;
let styleIndex = 0;
let styleUrl: string;
let stylesRuleList: string = '';
const styleNamePrefix = '_TSSP';
const keyframeNamePrefix = '_TSSK';

const styleLink = document.createElement('link');
styleLink.rel = 'stylesheet';
document.head.appendChild(styleLink);



const compileCSS = () => {
    const blob = new Blob([stylesRuleList], {type: 'text/css'});
    styleLink.href = styleUrl = window.URL.createObjectURL(blob);
    const event = document.createEvent("HTMLEvents");
    event.initEvent("hrefchanged", true, true);
    styleLink.dispatchEvent(event);
}

const compile = runIfInactive(compileCSS, 15);

const replaceChar = (text: string, charToReplace: string, callback: () => string): string => {
    let result = '';
    let i = 0, singleQuote = false, doubleQoute = false;
    for (; i < text.length; i++) {
        const char = text[i];
        if (singleQuote) {
            if (char === '\\') i++
            else if (char === "'") singleQuote = false;
        } else if (doubleQoute) {
            if (char === '\\') i++
            else if (char === '"') doubleQoute = false;
        } else if (char === charToReplace) {
            result += callback();
            continue;
        } else if (char === '"') {
            doubleQoute = true;
        } else if (char === "'") {
            singleQuote = true;
        }
        result += char;
    }

    return result;
}

const mediaWrapper = (media: string, content: string) => media ? `@media ${media}{${content}}` : content;

const prepareContent = (style: ITSStyle, checkOptions: Record<string, any> = {}) => {
    const propertiesList: string[] = [];
    const options: Record<string, string | string[]> = {};
    for (let name in style) {
        if (checkOptions[name]) {
            // @ts-ignore
            options[name] = style[name];
        } else {
            const propName = name.replace(/\_/g, '-');
            if (Array.isArray(style[name])) {
                (<String[]>(style[name])).forEach(v => {
                    propertiesList.push(`${propName}:${v};`);
                })
            } else {
                propertiesList.push(`${propName}:${style[name]};`);
            }
        }
    } 
    return { content: propertiesList.join(''), options };
}

const prepareStyle = (tsStyles: ITSStyle[], styleName = styleNamePrefix + (styleIndex++).toString(32)): string => {
    let result = '';

    tsStyles.forEach(style => {

        const {content, options} = prepareContent(style, {MEDIA: 1, SELECTOR: 1});
        let { MEDIA, SELECTOR } = options;
        MEDIA = <string> MEDIA;
        SELECTOR = SELECTOR || [];
        let cssSelector: string;
        if (SELECTOR.length) { // length is for both, string and array
            if (SELECTOR.constructor === String) SELECTOR = [<string>SELECTOR];
            cssSelector = (<string[]>SELECTOR).map(s => {
                s = s.trim();
                if (s.startsWith('=')) return replaceChar(s.substr(1), '@', () => '.' + styleName)
                if (s.startsWith('<')) return `${s.substr(1)} .${styleName}`;
                return `.${styleName} ${s}`;
            }).join(',');    
        } else {
            cssSelector = '.' + styleName;
        }

        let styleText = `${cssSelector}{${content}}`;
        styleText = mediaWrapper(MEDIA, styleText);
        result+= styleText;
    });

    postCss(result, styleName);

    return styleName;
}


const prepareFrames = (tsStyles: ITSStyle[], keyframeName = keyframeNamePrefix + (keyframeIndex++).toString(32)): string => {
    const stylesPerMedia: Record<string, any[]> = {};

    tsStyles.forEach(style => {

        const {content, options} = prepareContent(style, {MEDIA: 1, SELECTOR: 1});
        let { MEDIA, SELECTOR } = options;
        MEDIA = <string> MEDIA || '';
        SELECTOR = SELECTOR || [];
        let keySelector: string;
        if (SELECTOR.length) { // length is for both, string and array
            keySelector = SELECTOR.constructor === String ? <string>SELECTOR : (<string[]>SELECTOR).join(',');    
        } else {
            throw new Error('Missing selector');
        }
        if (!stylesPerMedia[MEDIA]) stylesPerMedia[MEDIA] = [];
        stylesPerMedia[MEDIA].push({
            keySelector,
            content
        });

    });

    let result = '';
    for (let media in stylesPerMedia) {
        result += mediaWrapper(media, `@keyframes ${keyframeName}{` + stylesPerMedia[media].map(spm => {
            return `${spm.keySelector}{${spm.content}};`
        }).join('')) + '}'
    }

    postCss(result, keyframeName);

    return keyframeName;
}

const prepareFont = (tsStyles: ITSStyle[]) => {
    let result = '';
    tsStyles.forEach(style => {
        const {content, options} = prepareContent(style, {MEDIA: 1});
        const { MEDIA } = options;
        result += mediaWrapper(<string> MEDIA, `@fontface{` + content + '}')
    });

    postCss(result);
}

export const getCssString = () => stylesRuleList;

export const postCss = (style: string, name?: string) => {
    if (style) {
        stylesRuleList += style;
        compile();
    }
}

export const childOf = (parent: string) => {
    parent = parent.trim();
    if (parent.startsWith(styleNamePrefix)) return `<.` + parent;
    return '<' + parent;
}

export const query = (q: string, ...params: string[]) => {
    let i = 0;
    return '=' + replaceChar(q, '%', () => '.' + params[i++]);
}

export const join = (...styleList: ITSStyle[]): ITSStyle => {
    return Object.assign({}, ...styleList);
}

export const globalStyles = () => {
    const link = <HTMLLinkElement>styleLink.cloneNode();
    styleLink.addEventListener('hrefchanged', () => {
        link.href = styleUrl;
    })
    return link;
}

export const tss = (styleNameOrStyle?: string | ITSStyle, ...styleList: ITSStyle[]): string => {
    if (styleNameOrStyle) {
        if (styleNameOrStyle.constructor === String) {
            return prepareStyle(styleList, <string>styleNameOrStyle)
        }
        styleList.unshift(<ITSStyle>styleNameOrStyle);    
    }
    return prepareStyle(styleList)
}

export const tssFrames = (keyframeNameOrStyle?: string | ITSStyle, ...styleList: ITSStyle[]): string => {
    if (keyframeNameOrStyle) {
        if (keyframeNameOrStyle.constructor === String) {
            return prepareFrames(styleList, <string>keyframeNameOrStyle)
        }
        styleList.unshift(<ITSStyle>keyframeNameOrStyle);    
    }

    return prepareFrames(styleList)
}

export const tssFont = (...styleList: ITSStyle[]) => prepareFont(styleList);