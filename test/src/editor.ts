import { div, body, shadow, cpt, span, textarea, text, button, br, iyyyymmdd, iyyyymm, ihhmm, inumber, itel, iemail, itext, icheckbox, iarray, iselect } from "../../dom"
import { tss, globalStyles, tssFrames, tssFont } from "../../tss"


const taStyle = tss({
    width: `50%`,
    height: `90%`,
});

const feedInitial = (src: HTMLTextAreaElement, dst: HTMLTextAreaElement) => {
    src.value = ``
    dst.value = `:=) ${src.value} (=:)`
}

class Editor extends HTMLElement {
    constructor() {
        super();

        const source = textarea({ class: taStyle });
        const destination = textarea({ class: taStyle });
        const btnTranslate = button({
            onclick: () => {
                destination.value = `:=) ${source.value} (=:)`
            }
        }, "Add smileys");

        feedInitial(source, destination);

        shadow(this, globalStyles(),
            div(
                source,
                destination,
            ),
            btnTranslate, 
            iyyyymmdd(), 
            iyyyymm(), 
            ihhmm(), 
            inumber({decimals: 2}), 
            itel(), 
            iemail(), 
            itext(),
            icheckbox(), br(),
            // iarray({decorator: itext}, {$:{ivalue: ['abcd', 'efgh']}} ),
            iselect({$:{ivalues: ['option 1', 'option 2'], ivalue: 1}})
        )
    }
}

export const editor = cpt<Editor>(Editor);