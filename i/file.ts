// function readSingleFile(e: Event) {
//     e.target
//     var file = e.target.files[0];
//     if (!file) {
//       return;
//     }
//     var reader = new FileReader();
//     reader.onload = function(e: Event) { // when reading finished do something
//     //   var contents = e.target.result;
//     //   displayContents(contents);
//     };
//     reader.readAsText(file);
//     reader.readAsDataURL
//     reader.readAsBinaryString
//     reader.readAsArrayBuffer
//     file
//   }

// //   document.getElementById('file-input')
// //   .addEventListener('change', readSingleFile, false);

import '../html/styles/input';
import input from '../html/fast/input';
import { attributes, setAttribs, IAttributesTemplate } from '../utils/attributes'
import onchange from '../on/change'

interface IParameters {
    value: boolean
}

export interface IICheckbox extends HTMLInputElement, IAttributesTemplate<IParameters> {}

export default (attribs?: any) => {
    const root = input('file');

    let value: FileList
    attributes((root: HTMLInputElement) => ({
        // value: {
        //     set: (value: boolean) => {
        //         root.checked = value || false;
        //     },
        //     get: () => root.checked
        // }
    }))(root);

    onchange((e) => {
        // const file = root.files[0]
    })(root)

    if (attribs) setAttribs(root, attribs);
    return <IICheckbox> root;
}
