import { IProperties } from './properties'
import { runIfInactive } from '../utils/debouncers';
import link from '../html/link';
import uid from '../utils/uid';
import event from '../on/methods/event';

export interface IStyleId {
    __tsm_sid: string
}
export type TPropertyValue = string | undefined | ITSStyle | IStyleId;



interface IOptions {
    MEDIA?: string | string[];
    M?: string | string[];

    PARENT_OF?: TPropertyValue | TPropertyValue[];
    P?: TPropertyValue | TPropertyValue[];

    CHILD_OF?: TPropertyValue | TPropertyValue[];
    C?: TPropertyValue | TPropertyValue[];

    EXACT?: string | string[];
    E?: string | string[];

    THIS?: TPropertyValue | TPropertyValue[];
    T?: TPropertyValue | TPropertyValue[];

    INHERITS?: TPropertyValue | TPropertyValue[];
    I?: TPropertyValue | TPropertyValue[];

    STEP?: string | string[];
    S?: string | string[];
}

export interface ITSStyleStrict extends IProperties, IOptions {
}


export interface ITSStyle extends ITSStyleStrict {
    [property: string]:  TPropertyValue | TPropertyValue[]; // except defined it also accepts undefined properties;
}
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

const prepareId = (): IStyleId => (
    {
        __tsm_sid: uid() 
    }
)
export const getStyleName = (id: IStyleId) => id.__tsm_sid;

const styleLink = link({rel: 'stylesheet'});
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


const makeArray = (...elements: any | any[] | undefined): any[] => 
    [].concat.apply([], 
        elements.filter((e: any) => e !== undefined)
        .map((e: any) => Array.isArray(e) ? e : [e])
    )

const getCssPropertyName = (name: string) => name.replace(/\_/g, '-');
const getSelector = (sel: TPropertyValue): string => {
    const name = getStyleName(<IStyleId>sel)
    return name ? '.' + name : <string>sel;
}


const precompileSkipProperties: ITSStyle = {
    MEDIA: '1',     M: '1',
    PARENT_OF: '1', P: '1',
    CHILD_OF: '1',  C: '1',
    EXACT: '1',     E: '1',
    THIS: '1',      T: '1',
    INHERITS: {},   I: {},
    STEP: '1',      S: '1',
}
const precompile = (name: string, style: ITSStyle) => {
    const media = makeArray(style.MEDIA, style.M); if (!media.length) media.push('');
    const parentOf = makeArray(style.PARENT_OF, style.P).map( p => `.${name}>${getSelector(p)}`)
    const childOf = makeArray(style.CHILD_OF, style.C).map( c => `${getSelector(c)}>.${name}`)
    const THIS = makeArray(style.THIS, style.T).map( c => '.' + name + getSelector(c))
    const exact = makeArray(style.EXACT, style.E)
    const steps = makeArray(style.STEP, style.S);
    const inherits = makeArray(style.INHERITS, style.I).map(i => {
        const name = getStyleName(i);
        if (name && styleRules[name]) 
            return Object.assign({}, ...styleRules[name].map(r => r.styleWithInherits));
        return i;
    })
    const styleWithInherits = Object.assign({}, ...inherits, style);

    const propertiesList: string[] = [];
    for (let propertyName in styleWithInherits) {
        if (!precompileSkipProperties[propertyName]) {
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

export const tss = (...stylesList: ITSStyle[]) => {
    const id = prepareId();
    const name = getStyleName(id);
    styleRules[name] = stylesList.map(s => precompile(name, s));
    compile()
    return id;
}
export const place = () => {
    const id = prepareId();
    const name = getStyleName(id);
    styleRules[name] = [precompile(name, {
        grid_area: name
    })];
    compile()
    return id;
}
export const layout = (...rows: IStyleId[][]) => {
    const id = prepareId();
    const name = getStyleName(id);
    styleRules[name] = [precompile(name, {
        grid_template_areas: rows.map(r => `"${r.map(getStyleName).join(' ')}"`).join(' '),
    })];
    compile()
    return id;
}

// borrows global styles to Custom components, so they can be shared and updated together
export const borrowStyles = () => {
    const link = <HTMLLinkElement>styleLink.cloneNode();
    onhrefchange(() => {
        link.href = styleUrl;
    })(link);
    return link
}
