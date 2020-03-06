import { TPropertyValue } from "./TPropertyValue";
import { TElementSelector } from "./TElementSelector";
import { TInheritSelector } from "./TInheritSelector";
import { IProperties } from "./IProperties";
import { IOptions } from "./IOptions";

// Layout plugin
import { TLayout, TArea } from "../layout/layout";
import { TPropertyBoolValue } from "./TPropertyBoolValue";

export interface ITSStyleStrict extends IProperties, IOptions {
}


export interface ITSStyle extends ITSStyleStrict {
    [property: string]:  
        TPropertyValue | TPropertyValue[] |
        TElementSelector | TElementSelector[] |
        TInheritSelector | TInheritSelector[] |

        TPropertyBoolValue | 
        TArea |
        TLayout; 
}