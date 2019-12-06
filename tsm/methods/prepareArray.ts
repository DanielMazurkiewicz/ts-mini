import { attributes } from '../../utils/attributes'
import removeChildren from '../../html/methods/removeChildren';

export default (root: Node) => {
    let setter: (value: any, child: any, parent: any) => any;
    let getter: (child: any, parent: any) => any;
    let creator: (value: any, parent: any) => any;

    var backup: any[];
    attributes((root: HTMLDivElement) => ({
        creator: {
            set: (value: any) => {
                creator = value;
            }
        },
        setter: {
            set: (value: any) => {
                setter = value;
            }
        },
        getter: {
            set: (value: any) => {
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
        }
    }))(root);

    return root;
}