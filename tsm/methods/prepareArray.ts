import { attributes } from '../../utils/attributes'
import removeChildren from '../../html/methods/removeChildren';
import throwError from '../../utils/throwError';
import getChildNodeIndex from './getChildNodeIndex';
import { ERROR_PREPARE_ARRAY_CREATOR_ALREADY_EXISTS, ERROR_PREPARE_ARRAY_SETTER_ALREADY_EXISTS, ERROR_PREPARE_ARRAY_GETTER_ALREADY_EXISTS, ERROR_PREPARE_ARRAY_CANT_REMOVE_NOT_A_CHILD } from '../../ERRORS';

export default (root: Node) => {
    let setter: (value: any, child: any, parent: any) => any;
    let getter: (child: any, parent: any) => any;
    let creator: (value: any, parent: any) => any;

    let isRequired: boolean
    let backup: any[];
    let min: number;
    let max: number;
    attributes((root: HTMLDivElement) => ({
        creator: {
            set: (value: any) => {
                // @ts-ignore
                if (creator) throwError(ERROR_PREPARE_ARRAY_CREATOR_ALREADY_EXISTS);
                creator = value;
            }
        },
        setter: {
            set: (value: any) => {
                // @ts-ignore
                if (setter) throwError(ERROR_PREPARE_ARRAY_SETTER_ALREADY_EXISTS);
                setter = value;
            }
        },
        getter: {
            set: (value: any) => {
                // @ts-ignore
                if (getter) throwError(ERROR_PREPARE_ARRAY_GETTER_ALREADY_EXISTS);
                getter = value;
            }
        },
        value: {
            set: (value: any[]) => {
                backup = value;
                let vlength = value.length;
                if (setter) {
                    const clength = root.childNodes.length;
                    const doRemoval = vlength < clength;
                    const loops = doRemoval ? vlength : clength
                    let i: number;
                    for (i = 0; i < loops; i++) {
                        setter(value[i], root.childNodes[i], root);
                    }
                    if (doRemoval) {
                        removeChildren(root, vlength);
                    } else {
                        for (; i < vlength; i++) {
                            root.appendChild(creator(value[i], root));
                        }
                    }
                } else {
                    // remove all
                    removeChildren(root);
                    // add all
                    for (let i = 0; i < vlength; i++) {
                        root.appendChild(creator(value[i], root));
                    }
                }
            },
            get: () => {
                if (!getter) return backup;
                const result = [];
                const clength = root.childNodes.length;
                for (let i = 0; i < clength; i++) {
                    result.push(getter(root.childNodes[i], root))
                }
                return result;
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
        min: {
            set: (v: number) => min = v
        },
        max: {
            set: (v: number) => max = v
        },
        add: (value: any) => {
            root.appendChild(creator(value, root));
        },
        remove: (element: number | Node) => {
            // @ts-ignore
            if (getter) {
                if (typeof element === 'number') {
                    root.removeChild(root.childNodes[element]);
                } else {
                    root.removeChild(element);
                }
            } else {
                if (typeof element === 'number') {
                    backup = backup.filter((e, i) => i !== element);
                    root.removeChild(root.childNodes[element]);
                } else {
                    const index = getChildNodeIndex(root, element);
                    if (index < 0) throwError(ERROR_PREPARE_ARRAY_CANT_REMOVE_NOT_A_CHILD); // Node is not a child of given root
                    backup = backup.filter((e, i) => i !== index);
                    root.removeChild(element);
                }
            }
        },
        move: () => {

        },
        
    }))(root);

    return root;
}