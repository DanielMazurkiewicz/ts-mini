import { TTime, TDate } from "../dateTime";

export interface TsmIValueComponentsAny {
    ivaluecomponents?: any,
}
export interface TsmIValueAny {
    ivalue?: any,
}
export interface TsmIValueString extends TsmIValueAny{
    ivalue: string,
}
export interface TsmIValueNumber extends TsmIValueAny{
    ivalue: number,
}
export interface TsmIValueBoolean extends TsmIValueAny{
    ivalue: boolean,
}
export interface TsmICheckValidity {
    checkValidity?: (...arg: any) => any
}
export interface TsmCommonBase extends TsmIValueAny, TsmIValueComponentsAny {}
export interface TsmCommonBaseExtended extends TsmIValueAny, TsmICheckValidity, TsmIValueComponentsAny {}


export interface TsmICheckbox extends TsmInputElement {
    ivalue: boolean
}
export interface TsmIEmail extends TsmInputElement {
    ivalue: string
}
export interface TsmIText extends TsmInputElement {
    ivalue: string
}
export interface TsmITextArea extends TsmTextAreaElement {
    ivalue: string
}
export interface TsmITel extends TsmInputElement {
    ivalue: string
}
export interface TsmINumber extends TsmInputElement {
    ivalue: number
}
export interface TsmIHhmm extends TsmInputElement {
    ivalue: TTime
}
export interface TsmIHhmm extends TsmInputElement {
    ivalue: TTime
}
export interface TsmIYyyymm extends TsmInputElement {
    ivalue: TDate
}
export interface TsmIYyyymmdd extends TsmInputElement {
    ivalue: TDate
}
export interface TsmIArray extends TsmElement {
    ivalue: any,
    iadd: (ivalue: any) => void,
}
export interface TsmIRecord extends TsmElement {
    ivalue: any
    iadd: (ivalue: any, ikey?: any) => void,
}

export interface TsmITextPlace extends TsmTextPlaceElement {
    ivalue: string
}
export interface TsmIHhmmPlace extends TsmTextPlaceElement {
    ivalue: TTime
}
export interface TsmIHhmmPlace extends TsmTextPlaceElement {
    ivalue: TTime
}
export interface TsmIYyyymmPlace extends TsmTextPlaceElement {
    ivalue: TDate
}
export interface TsmIYyyymmddPlace extends TsmTextPlaceElement {
    ivalue: TDate
}
export interface TsmINumberPlace extends TsmTextPlaceElement {
    ivalue: number
}

export interface TsmTextPlaceElement extends Text, TsmCommonBaseExtended {}

export interface TsmElement extends HTMLElement, TsmCommonBaseExtended {}

export interface TsmAnchorElement extends HTMLAnchorElement, TsmCommonBaseExtended {}

export interface TsmAppletElement extends HTMLAppletElement, TsmCommonBaseExtended {}

export interface TsmAreaElement extends HTMLAreaElement, TsmCommonBaseExtended {}

export interface TsmAudioElement extends HTMLAudioElement, TsmCommonBaseExtended {}

export interface TsmBaseElement extends HTMLBaseElement, TsmCommonBaseExtended {}

export interface TsmBaseFontElement extends HTMLBaseFontElement, TsmCommonBaseExtended {}

export interface TsmQuoteElement extends HTMLQuoteElement, TsmCommonBaseExtended {}

export interface TsmBRElement extends HTMLBRElement, TsmCommonBaseExtended {}

export interface TsmButtonElement extends HTMLButtonElement, TsmCommonBase {}

export interface TsmCanvasElement extends HTMLCanvasElement, TsmCommonBaseExtended {}

export interface TsmTableCaptionElement extends HTMLTableCaptionElement, TsmCommonBaseExtended {}

export interface TsmTableColElement extends HTMLTableColElement, TsmCommonBaseExtended {}

export interface TsmDataListElement extends HTMLDataListElement, TsmCommonBaseExtended {}

export interface TsmModElement extends HTMLModElement, TsmCommonBaseExtended {}

export interface TsmDetailsElement extends HTMLDetailsElement, TsmCommonBaseExtended {}

export interface TsmDivElement extends HTMLDivElement, TsmCommonBaseExtended {}

export interface TsmEmbedElement extends HTMLEmbedElement, TsmCommonBaseExtended {}

export interface TsmFieldSetElement extends HTMLFieldSetElement, TsmCommonBase {}

export interface TsmFontElement extends HTMLFontElement, TsmCommonBaseExtended {}

export interface TsmFormElement extends HTMLFormElement, TsmCommonBase {}

export interface TsmFrameElement extends HTMLFrameElement, TsmCommonBaseExtended {}

export interface TsmFrameSetElement extends HTMLFrameSetElement, TsmCommonBaseExtended {}

export interface TsmHeadingElement extends HTMLHeadingElement, TsmCommonBaseExtended {}

export interface TsmHeadElement extends HTMLHeadElement, TsmCommonBaseExtended {}

export interface TsmHRElement extends HTMLHRElement, TsmCommonBaseExtended {}

export interface TsmHtmlElement extends HTMLHtmlElement, TsmCommonBaseExtended {}

export interface TsmIFrameElement extends HTMLIFrameElement, TsmCommonBaseExtended {}

export interface TsmImageElement extends HTMLImageElement, TsmCommonBaseExtended {}

export interface TsmInputElement extends HTMLInputElement, TsmCommonBase {}

export interface TsmLabelElement extends HTMLLabelElement, TsmCommonBaseExtended {}

export interface TsmLegendElement extends HTMLLegendElement, TsmCommonBaseExtended {}

export interface TsmLIElement extends HTMLLIElement, TsmCommonBaseExtended {}

export interface TsmLinkElement extends HTMLLinkElement, TsmCommonBaseExtended {}

export interface TsmMapElement extends HTMLMapElement, TsmCommonBaseExtended {}

export interface TsmMenuElement extends HTMLMenuElement, TsmCommonBaseExtended {}

export interface TsmMetaElement extends HTMLMetaElement, TsmCommonBaseExtended {}

export interface TsmMeterElement extends HTMLMeterElement, TsmCommonBaseExtended {}

export interface TsmObjectElement extends HTMLObjectElement, TsmCommonBase {}

export interface TsmOListElement extends HTMLOListElement, TsmCommonBaseExtended {}

export interface TsmOptGroupElement extends HTMLOptGroupElement, TsmCommonBaseExtended {}

export interface TsmOptionElement extends HTMLOptionElement, TsmCommonBaseExtended {}

export interface TsmOutputElement extends HTMLOutputElement, TsmCommonBase {}

export interface TsmParagraphElement extends HTMLParagraphElement, TsmCommonBaseExtended {}

export interface TsmParamElement extends HTMLParamElement, TsmCommonBaseExtended {}

export interface TsmPreElement extends HTMLPreElement, TsmCommonBaseExtended {}

export interface TsmProgressElement extends HTMLProgressElement, TsmCommonBaseExtended {}

export interface TsmScriptElement extends HTMLScriptElement, TsmCommonBaseExtended {}

export interface TsmSelectElement extends HTMLSelectElement, TsmCommonBase {}

export interface TsmSourceElement extends HTMLSourceElement, TsmCommonBaseExtended {}

export interface TsmSpanElement extends HTMLSpanElement, TsmCommonBaseExtended {}

export interface TsmStyleElement extends HTMLStyleElement, TsmCommonBaseExtended {}

export interface TsmTableElement extends HTMLTableElement, TsmCommonBaseExtended {}

export interface TsmTableSectionElement extends HTMLTableSectionElement, TsmCommonBaseExtended {}

export interface TsmTableDataCellElement extends HTMLTableDataCellElement, TsmCommonBaseExtended {}

export interface TsmTextAreaElement extends HTMLTextAreaElement, TsmCommonBase {}

export interface TsmTableHeaderCellElement extends HTMLTableHeaderCellElement, TsmCommonBaseExtended {}

export interface TsmTimeElement extends HTMLTimeElement, TsmCommonBaseExtended {}

export interface TsmTitleElement extends HTMLTitleElement, TsmCommonBaseExtended {}

export interface TsmTableRowElement extends HTMLTableRowElement, TsmCommonBaseExtended {}

export interface TsmTrackElement extends HTMLTrackElement, TsmCommonBaseExtended {}

export interface TsmUListElement extends HTMLUListElement, TsmCommonBaseExtended {}

export interface TsmVideoElement extends HTMLVideoElement, TsmCommonBaseExtended {}

export interface TsmSlotElement extends HTMLSlotElement, TsmCommonBaseExtended {}
