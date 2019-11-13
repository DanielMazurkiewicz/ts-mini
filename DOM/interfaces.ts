import { TTime, TDate } from "../dateTime";


export interface TsmIsNotValid {
    iIsNotValid?: (...args: any) => any
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
export interface TsmCommonBase extends TsmIValueAny, TsmIsNotValid {}



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



export interface TsmTextPlaceElement extends Text, TsmCommonBase {}

export interface TsmNode extends Node, TsmCommonBase {}

export interface TsmElement extends HTMLElement, TsmCommonBase {}

export interface TsmAnchorElement extends HTMLAnchorElement, TsmCommonBase {}

export interface TsmAppletElement extends HTMLAppletElement, TsmCommonBase {}

export interface TsmAreaElement extends HTMLAreaElement, TsmCommonBase {}

export interface TsmAudioElement extends HTMLAudioElement, TsmCommonBase {}

export interface TsmBaseElement extends HTMLBaseElement, TsmCommonBase {}

export interface TsmBaseFontElement extends HTMLBaseFontElement, TsmCommonBase {}

export interface TsmQuoteElement extends HTMLQuoteElement, TsmCommonBase {}

export interface TsmBRElement extends HTMLBRElement, TsmCommonBase {}

export interface TsmButtonElement extends HTMLButtonElement, TsmCommonBase {}

export interface TsmCanvasElement extends HTMLCanvasElement, TsmCommonBase {}

export interface TsmTableCaptionElement extends HTMLTableCaptionElement, TsmCommonBase {}

export interface TsmTableColElement extends HTMLTableColElement, TsmCommonBase {}

export interface TsmDataListElement extends HTMLDataListElement, TsmCommonBase {}

export interface TsmModElement extends HTMLModElement, TsmCommonBase {}

export interface TsmDetailsElement extends HTMLDetailsElement, TsmCommonBase {}

export interface TsmDivElement extends HTMLDivElement, TsmCommonBase {}

export interface TsmEmbedElement extends HTMLEmbedElement, TsmCommonBase {}

export interface TsmFieldSetElement extends HTMLFieldSetElement, TsmCommonBase {}

export interface TsmFontElement extends HTMLFontElement, TsmCommonBase {}

export interface TsmFormElement extends HTMLFormElement, TsmCommonBase {}

export interface TsmFrameElement extends HTMLFrameElement, TsmCommonBase {}

export interface TsmFrameSetElement extends HTMLFrameSetElement, TsmCommonBase {}

export interface TsmHeadingElement extends HTMLHeadingElement, TsmCommonBase {}

export interface TsmHeadElement extends HTMLHeadElement, TsmCommonBase {}

export interface TsmHRElement extends HTMLHRElement, TsmCommonBase {}

export interface TsmHtmlElement extends HTMLHtmlElement, TsmCommonBase {}

export interface TsmIFrameElement extends HTMLIFrameElement, TsmCommonBase {}

export interface TsmImageElement extends HTMLImageElement, TsmCommonBase {}

export interface TsmInputElement extends HTMLInputElement, TsmCommonBase {}

export interface TsmLabelElement extends HTMLLabelElement, TsmCommonBase {}

export interface TsmLegendElement extends HTMLLegendElement, TsmCommonBase {}

export interface TsmLIElement extends HTMLLIElement, TsmCommonBase {}

export interface TsmLinkElement extends HTMLLinkElement, TsmCommonBase {}

export interface TsmMapElement extends HTMLMapElement, TsmCommonBase {}

export interface TsmMenuElement extends HTMLMenuElement, TsmCommonBase {}

export interface TsmMetaElement extends HTMLMetaElement, TsmCommonBase {}

export interface TsmMeterElement extends HTMLMeterElement, TsmCommonBase {}

export interface TsmObjectElement extends HTMLObjectElement, TsmCommonBase {}

export interface TsmOListElement extends HTMLOListElement, TsmCommonBase {}

export interface TsmOptGroupElement extends HTMLOptGroupElement, TsmCommonBase {}

export interface TsmOptionElement extends HTMLOptionElement, TsmCommonBase {}

export interface TsmOutputElement extends HTMLOutputElement, TsmCommonBase {}

export interface TsmParagraphElement extends HTMLParagraphElement, TsmCommonBase {}

export interface TsmParamElement extends HTMLParamElement, TsmCommonBase {}

export interface TsmPreElement extends HTMLPreElement, TsmCommonBase {}

export interface TsmProgressElement extends HTMLProgressElement, TsmCommonBase {}

export interface TsmScriptElement extends HTMLScriptElement, TsmCommonBase {}

export interface TsmSelectElement extends HTMLSelectElement, TsmCommonBase {}

export interface TsmSourceElement extends HTMLSourceElement, TsmCommonBase {}

export interface TsmSpanElement extends HTMLSpanElement, TsmCommonBase {}

export interface TsmStyleElement extends HTMLStyleElement, TsmCommonBase {}

export interface TsmTableElement extends HTMLTableElement, TsmCommonBase {}

export interface TsmTableSectionElement extends HTMLTableSectionElement, TsmCommonBase {}

export interface TsmTableDataCellElement extends HTMLTableDataCellElement, TsmCommonBase {}

export interface TsmTextAreaElement extends HTMLTextAreaElement, TsmCommonBase {}

export interface TsmTableHeaderCellElement extends HTMLTableHeaderCellElement, TsmCommonBase {}

export interface TsmTimeElement extends HTMLTimeElement, TsmCommonBase {}

export interface TsmTitleElement extends HTMLTitleElement, TsmCommonBase {}

export interface TsmTableRowElement extends HTMLTableRowElement, TsmCommonBase {}

export interface TsmTrackElement extends HTMLTrackElement, TsmCommonBase {}

export interface TsmUListElement extends HTMLUListElement, TsmCommonBase {}

export interface TsmVideoElement extends HTMLVideoElement, TsmCommonBase {}

export interface TsmSlotElement extends HTMLSlotElement, TsmCommonBase {}
