import { runIfInactive } from '../utils/debouncers';
import link from '../html/link';
import event from '../on/methods/event';
import getStyleName from './methods/getStyleName';
import prepareId from './methods/prepareId';
import makeArray from '../utils/makeArray';
import { ITSStyle } from './structures/ITSStyle';
import { reservedProperties, pluginList } from './pluginsManagement';
import { TStyleId } from './structures/TStyleId';
import { TElementSelector } from './structures/TElementSelector';




interface IPrecompiled {
    media: string[],
    selectors: string,
    frameSteps: string,
    content: string,
    styleWithInherits: ITSStyle
}
type TStyleRules = Record<string, IPrecompiled[]>

let styleUrl: string;

const styleRules: TStyleRules = {}


export const styleLink = link({rel: 'stylesheet'});
document.head.appendChild(styleLink);


const compileToCSS = (styleRules: TStyleRules): string => {
    const byMedia: Record<string, string> = {};

    for (let name in styleRules) {
        const rules = styleRules[name];
        const frameStepsByMedia: Record<string, string> = {};
        rules.forEach(({ media, selectors, frameSteps, content }) => {
            media.forEach(m => {
                if (selectors) {
                    if (!byMedia[m]) byMedia[m] = '';
                    byMedia[m] += selectors + content;    
                }
                if (frameSteps) {
                    if (!frameStepsByMedia[m]) frameStepsByMedia[m] = '';
                    frameStepsByMedia[m] += frameSteps + content;
                }
            })
        })
        for (let m in frameStepsByMedia) {
            if (!byMedia[m]) byMedia[m] = '';
            byMedia[m] += `@keyframes ${name}${frameStepsByMedia[m]}`;    
        }
    }
    let result = ''
    for (let media in byMedia) {
        result += media ? `@media ${media}{${byMedia[media]}}` : byMedia[media];
    }

    return result;
}

export const onhrefchange = event();

const updateStyleLink = () => {
    const blob = new Blob([compileToCSS(styleRules)], {type: 'text/css'});
    styleLink.href = styleUrl = window.URL.createObjectURL(blob);
    onhrefchange.$(styleLink);
}

const compile = runIfInactive(updateStyleLink, 15);


const getCssPropertyName = (name: string) => name.replace(/\_/g, '-');
const getSelector = (sel: TElementSelector): string => {
    const name = getStyleName(<TStyleId>sel)
    return name ? '.' + name : <string>sel;
}



const precompile = (name: string, style: ITSStyle) => {
    const media = makeArray(style.MEDIA, style.M); if (!media.length) media.push('');
    const parentOf = makeArray(style.PARENT_OF, style.P).map( p => `.${name}>${getSelector(p)}`);
    const childOf = makeArray(style.CHILD_OF, style.C).map( c => `${getSelector(c)}>.${name}`);
    const THIS = makeArray(style.THIS, style.T).map( c => '.' + name + getSelector(c));
    const exact = makeArray(style.EXACT, style.E);
    const steps = makeArray(style.STEP, style.S);
    const inherits = makeArray(style.INHERITS, style.I).map(i => {
        const name = getStyleName(i);
        if (name && styleRules[name]) 
            return Object.assign({}, ...styleRules[name].map(r => r.styleWithInherits));
        return i;
    });

    const computedStyle: ITSStyle = {};
    pluginList.forEach(p=> p(name, style, computedStyle));
    const styleWithInherits = Object.assign({}, ...inherits, computedStyle, style);


    const propertiesList: string[] = [];
    for (let propertyName in styleWithInherits) {
        if (!reservedProperties[propertyName]) {
            const styleProperty = styleWithInherits[propertyName];
            const cssPropertyName = getCssPropertyName(propertyName);
            if (Array.isArray(styleProperty)) {
                (<String[]>(styleProperty)).forEach(v => {
                    propertiesList.push(`${cssPropertyName}:${v};`);
                })
            } else {
                propertiesList.push(`${cssPropertyName}:${styleProperty};`);
            }
        }
    }
    const selectors = (THIS.length || parentOf.length || childOf.length) ? 
        makeArray(THIS, parentOf, childOf, exact).join(','):
        makeArray(`.${name}`, exact).join(',');

    const frameSteps = steps.join('')
    const content = `{${propertiesList.join('')}}`
    return {
        media,
        selectors,
        frameSteps,
        content,
        styleWithInherits
    } as IPrecompiled
}

export const tss = <ReturnType = TStyleId>(...stylesList: (ITSStyle | Function)[]) => {
    const list: ITSStyle[] = [];
    let constructor: Function | undefined;
    for (let i = 0; i < stylesList.length; i++) {
        const el = stylesList[i];
        if (typeof el === 'function') {
            constructor = el;
        } else {
            list.push(el)
        }
    }

    const id = constructor ? prepareId((...args: any[]) => {
        // @ts-ignore
        const result = constructor(...args);
        if (result instanceof HTMLElement) result.classList.add(name);
        return result;
    }): prepareId();
    const name = getStyleName(id);
    styleRules[name] = list.map(s => precompile(name, s));
    compile()
    return <ReturnType><unknown>id;
}

// borrows global styles to Custom components, so they can be shared and updated together
export const borrowStyles = () => {
    const link = <HTMLLinkElement>styleLink.cloneNode();
    onhrefchange(() => {
        link.href = styleUrl;
    })(link);
    return link
}

export const givenElement = (element: HTMLElement) => element;