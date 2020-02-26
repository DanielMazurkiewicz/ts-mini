import '../../html/styles/e/video';
// import evideo from '../../html/fast/e/video';
import video from '../../html/fast/video';
import canvas from '../../html/fast/canvas';
import { attributes, setAttribs, IAttributesTemplate } from '../../utils/attributes'
import onattach from '../../on/attach';

interface IParameters {
    value: string | ImageData
    isRequired: boolean
    placeholder: string | undefined
    isValid: boolean
}

export interface IICamera extends HTMLVideoElement, IAttributesTemplate<IParameters> {}

export default (attribs?: any) => {
    const root = video();
    const preview = canvas();
    const ctx = preview.getContext('2d');

    let isRequired : boolean
    let placeholder : string

    let fps = 1000 / 25; // interval in miliseconds


    let vidSz = {width: 640, height: 480  , facingMode: "user" };
    // if (document.body.clientWidth < 600 ){
    //     vidSz = true;
    // }
    navigator.mediaDevices.getUserMedia({
        audio: false, 
        video: true
    }).then(function(mediaStream) {
        root.srcObject = mediaStream;
        root.onloadedmetadata = function() {
            preview.width = root.videoWidth;
            preview.height = root.videoHeight;
            root.play();
        }
        root.addEventListener('play', function () {
            let loop = function() {
                if (!root.paused && !root.ended) {

                    setTimeout(loop, fps);
                }else{
                    console.log("Video stream stopped");
                }
            }
            /* Start painting on the canvas */
            loop();
        });
    }).catch(function(err){
        console.log("Access not granted", err);
    });





    attributes((root: HTMLVideoElement) => ({
        value: {
            set: (value: string | number) => {

            },
            get: () => {
                if (ctx) {
                    ctx.drawImage(root, 0, 0);
                    return ctx.getImageData(0,0, preview.width, preview.height);
                }
            }
        },
        preview: {
            set: (value: string | number) => {

            },
            get: () => {
            }
        },
        type: {
            set: (value: string) => {
                // jpeg, png, ImageData, 
            }
        },
        isValid: {
            get: () => {
                // return !isRequired || (isRequired && (root.value !== ''))
            }
        },
        isRequired: {
            set: (v: boolean) => isRequired = v,
            get: () => isRequired
        },
    }))(root);

    if (attribs) setAttribs(root, attribs);
    return <IICamera> root;
}



// This is for qrcode reading array
const gray = () => {
    // let gray = new Uint8ClampedArray( Module.HEAPU8.buffer, grayBuf, imgData.width * imgData.height);
    // for (let i = 0; i < imgData.data.length ; i += 4) {
    //     gray[i >> 2] = (imgData.data[i] * 306 + imgData.data[i + 1] * 601 + imgData.data[i + 2] * 117) >> 10;
    // }
}