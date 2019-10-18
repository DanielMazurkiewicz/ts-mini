import { TTime, TDate } from "../dateTime";

export interface TsmCommon {
    ivalue?: any
}

export interface TsmICheckbox extends TsmInputElement {
    ivalue: boolean
}
export interface TsmIEmail extends TsmInputElement {
    ivalue: string
}
export interface TsmIText extends TsmInputElement {
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
    ivalue: any[]
}

export interface TsmElement extends HTMLElement, TsmCommon {}

export interface TsmAnchorElement extends HTMLAnchorElement, TsmCommon {}

export interface TsmAppletElement extends HTMLAppletElement, TsmCommon {}

export interface TsmAreaElement extends HTMLAreaElement, TsmCommon {}

export interface TsmAudioElement extends HTMLAudioElement, TsmCommon {}

export interface TsmBaseElement extends HTMLBaseElement, TsmCommon {}

export interface TsmBaseFontElement extends HTMLBaseFontElement, TsmCommon {}

export interface TsmQuoteElement extends HTMLQuoteElement, TsmCommon {}

export interface TsmBRElement extends HTMLBRElement, TsmCommon {}

export interface TsmButtonElement extends HTMLButtonElement, TsmCommon {}

export interface TsmCanvasElement extends HTMLCanvasElement, TsmCommon {}

export interface TsmTableCaptionElement extends HTMLTableCaptionElement, TsmCommon {}

export interface TsmTableColElement extends HTMLTableColElement, TsmCommon {}

export interface TsmDataListElement extends HTMLDataListElement, TsmCommon {}

export interface TsmModElement extends HTMLModElement, TsmCommon {}

export interface TsmDetailsElement extends HTMLDetailsElement, TsmCommon {}

export interface TsmDivElement extends HTMLDivElement, TsmCommon {}

export interface TsmEmbedElement extends HTMLEmbedElement, TsmCommon {}

export interface TsmFieldSetElement extends HTMLFieldSetElement, TsmCommon {}

export interface TsmFontElement extends HTMLFontElement, TsmCommon {}

export interface TsmFormElement extends HTMLFormElement, TsmCommon {}

export interface TsmFrameElement extends HTMLFrameElement, TsmCommon {}

export interface TsmFrameSetElement extends HTMLFrameSetElement, TsmCommon {}

export interface TsmHeadingElement extends HTMLHeadingElement, TsmCommon {}

export interface TsmHeadElement extends HTMLHeadElement, TsmCommon {}

export interface TsmHRElement extends HTMLHRElement, TsmCommon {}

export interface TsmHtmlElement extends HTMLHtmlElement, TsmCommon {}

export interface TsmIFrameElement extends HTMLIFrameElement, TsmCommon {}

export interface TsmImageElement extends HTMLImageElement, TsmCommon {}

export interface TsmInputElement extends HTMLInputElement, TsmCommon {}

export interface TsmLabelElement extends HTMLLabelElement, TsmCommon {}

export interface TsmLegendElement extends HTMLLegendElement, TsmCommon {}

export interface TsmLIElement extends HTMLLIElement, TsmCommon {}

export interface TsmLinkElement extends HTMLLinkElement, TsmCommon {}

export interface TsmMapElement extends HTMLMapElement, TsmCommon {}

export interface TsmMenuElement extends HTMLMenuElement, TsmCommon {}

export interface TsmMetaElement extends HTMLMetaElement, TsmCommon {}

export interface TsmMeterElement extends HTMLMeterElement, TsmCommon {}

export interface TsmObjectElement extends HTMLObjectElement, TsmCommon {}

export interface TsmOListElement extends HTMLOListElement, TsmCommon {}

export interface TsmOptGroupElement extends HTMLOptGroupElement, TsmCommon {}

export interface TsmOptionElement extends HTMLOptionElement, TsmCommon {}

export interface TsmOutputElement extends HTMLOutputElement, TsmCommon {}

export interface TsmParagraphElement extends HTMLParagraphElement, TsmCommon {}

export interface TsmParamElement extends HTMLParamElement, TsmCommon {}

export interface TsmPreElement extends HTMLPreElement, TsmCommon {}

export interface TsmProgressElement extends HTMLProgressElement, TsmCommon {}

export interface TsmScriptElement extends HTMLScriptElement, TsmCommon {}

export interface TsmSelectElement extends HTMLSelectElement, TsmCommon {}

export interface TsmSourceElement extends HTMLSourceElement, TsmCommon {}

export interface TsmSpanElement extends HTMLSpanElement, TsmCommon {}

export interface TsmStyleElement extends HTMLStyleElement, TsmCommon {}

export interface TsmTableElement extends HTMLTableElement, TsmCommon {}

export interface TsmTableSectionElement extends HTMLTableSectionElement, TsmCommon {}

export interface TsmTableDataCellElement extends HTMLTableDataCellElement, TsmCommon {}

export interface TsmTextAreaElement extends HTMLTextAreaElement, TsmCommon {}

export interface TsmTableHeaderCellElement extends HTMLTableHeaderCellElement, TsmCommon {}

export interface TsmTimeElement extends HTMLTimeElement, TsmCommon {}

export interface TsmTitleElement extends HTMLTitleElement, TsmCommon {}

export interface TsmTableRowElement extends HTMLTableRowElement, TsmCommon {}

export interface TsmTrackElement extends HTMLTrackElement, TsmCommon {}

export interface TsmUListElement extends HTMLUListElement, TsmCommon {}

export interface TsmVideoElement extends HTMLVideoElement, TsmCommon {}

export interface TsmSlotElement extends HTMLSlotElement, TsmCommon {}
