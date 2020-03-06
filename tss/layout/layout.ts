import { tss } from "../tss";
import { TStyleId } from "../structures/TStyleId";
import { TEnum } from "../../types";
import { ITSStyle } from "../structures/ITSStyle";
import getStyleName from "../methods/getStyleName";
import { pluginAdd } from "../pluginsManagement";
import dashJoin from "../methods/dashJoin";

import keywordInline from '../keywords/inline';
import keywordGrid from '../keywords/grid';
import TSS_AREA from '../TSS/AREA'
import share from "../decor/share";

type TLayoutDimmension = string | number | boolean;
type TLayoutColumnDimmensions = TLayoutDimmension[];
type TLayoutRow = TStyleId[];

export type TLayout = (ITSStyle | TLayoutDimmension | TLayoutColumnDimmensions | TLayoutRow)[] | number;
export type TArea = TStyleId | string | TEnum | [number, number] | [number, number, number, number];  
                                                // string - direct point
                                                // TSTyleId - other area definition 
                                                // TEnum - area definition 
                                                // TODO: Array support





export const area = <ReturnType = TStyleId>(...stylesList: (ITSStyle | Function)[]) => stylesList.length ?
    <ReturnType>tss(...stylesList.map(s => (typeof s === 'function') ? s : Object.assign({}, s, {A: s.A || s.AREA || TSS_AREA}))) :
    <ReturnType>tss({A: TSS_AREA})


const pluginPropertiesReservation: ITSStyle = {
    ITEM: 1,
    LAYOUT: [],             L: [],
    AREA: 1,                A: 1,
                            H: '1',
                            V: '1',
}

const plugin = (name: string, style: ITSStyle, computedStyle: ITSStyle) => {
    const layoutDefinition = style.L || style.LAYOUT;
    let styleDisplay: string | undefined;
    if (layoutDefinition) {
        if (layoutDefinition instanceof Array) {
            let gta: string[] = [];
            let gtr: string[] = [];
    
            for (let layerIndex = 0; layerIndex < layoutDefinition.length; layerIndex++) {
                const layer = layoutDefinition[layerIndex];
                if (layer instanceof Array) {
                    if (getStyleName((<TLayoutRow>layer)[0])) {
                        gta.push(`"${(<TLayoutRow>layer).map(getStyleName).join(' ')}"`)
                    } else {
                        //@ts-ignore
                        computedStyle.grid_template_columns = (<TLayoutColumnDimmensions>layer).map(share).join(' ');
                    }
                } else if (typeof layer === 'object') {
                    Object.assign(computedStyle, layer);
                } else {
                    // @ts-ignore
                    gtr.push(share(layer))
                }
            }
            if (gta.length) computedStyle.grid_template_areas = gta.join(' ');
            if (gtr.length) computedStyle.grid_template_rows = gtr.join(' ');
            if (style.ITEM) {
                styleDisplay = dashJoin(keywordInline, keywordGrid);
            } else {
                styleDisplay = keywordGrid;
                // computedStyle.height = TSS_FULL;
                // computedStyle.width = TSS_FULL;
            }    
        } else {
            // styleDisplay = style.ITEM ? dashJoin(keywordInline, keywordFlex) : keywordFlex ;
            // let styleFlexDirection: string | undefined;
            // switch (layoutDefinition) {
            //     case TSS_ROWS:
            //         // flex-direction: row | row-reverse | column | column-reverse;
            //         styleFlexDirection = 'column';
            //         break;
            //     case TSS_COLUMNS:
            //         styleFlexDirection = 'row';
            //         break;
            // }
            // if (styleFlexDirection) computedStyle.flex_direction = styleFlexDirection;
        }

    } else { // non layout
        if (style.ITEM) {
            styleDisplay = keywordInline
        }
    }

    if (styleDisplay) computedStyle.display = styleDisplay;

    const area = style.A || style.AREA;
    if (area) {
        let style: string, styleName: string
        if (typeof area === 'string') {
            style = area;
        } else if (area instanceof Array) {
            if (area.length === 2) {
                style = `span ${area[1]}/span ${area[0]}`
            } else {
                style = `${area[1]}/${area[0]}/span ${area[3]}/span ${area[2]}`
            }
        // @ts-ignore
        } else if (styleName = getStyleName(area)) {
            style = styleName;
        } else {
            style = name;
        }
        computedStyle.grid_area = style;
    }

    if (style.H) computedStyle.justify_self = style.H;
    if (style.V) computedStyle.align_self = style.V;
    
}

pluginAdd(plugin, pluginPropertiesReservation);