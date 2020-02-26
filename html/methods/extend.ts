import onattach from '../../on/attach';
import ondetach from '../../on/detach';


export default (type: any, tagName: string) => {
    // class ExtendedElement extends HTMLVideoElement {
    class ExtendedElement extends type {
            constructor() {
            super();
            console.log('Here')
        }
        connectedCallback() {
            setTimeout(()=> {
                // @ts-ignore
                onattach.$(this);
                console.log('Att')
            }, 0)
        }
        disconnectedCallback() {
            // @ts-ignore
            ondetach.$(this);
        }          
        adoptedCallback() {
            // @ts-ignore
            onattach.$(this);
            // @ts-ignore
            ondetach.$(this);
        }
    }
    console.log('huhuhu')
    const newTag = 'e-' + tagName;
    customElements.define(newTag, ExtendedElement, { extends: tagName });
    return newTag;
}


// class ExtendedElement extends HTMLElement {
//     constructor() {
//         super();
//         console.log('Here')
//     }
//     connectedCallback() {
//         setTimeout(()=> {
//             // @ts-ignore
//             onattach.$(this);
//             console.log('Att')
//         }, 0)
//     }
//     disconnectedCallback() {
//         // @ts-ignore
//         ondetach.$(this);
//     }          
//     adoptedCallback() {
//         // @ts-ignore
//         onattach.$(this);
//         // @ts-ignore
//         ondetach.$(this);
//     }
// }

// export default (type: any, tagName: string) => {
//     // class ExtendedElement extends HTMLVideoElement {

//     console.log('huhuhju')
//     const newTag = 'e-' + tagName;
//     customElements.define(newTag, ExtendedElement, { extends: 'div' });
//     return newTag;
// }