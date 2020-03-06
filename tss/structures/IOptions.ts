import { TElementSelector } from "./TElementSelector";
import { TInheritSelector } from "./TInheritSelector";
import { TPropertyBoolValue } from "./TPropertyBoolValue";
import { TLayout, TArea } from "../layout/layout";

export interface IOptions {
    MEDIA?: string | string[];
    M?: string | string[];

    PARENT_OF?: TElementSelector | TElementSelector[];
    P?: TElementSelector | TElementSelector[];

    CHILD_OF?: TElementSelector | TElementSelector[];
    C?: TElementSelector | TElementSelector[];

    EXACT?: string | string[];
    E?: string | string[];

    THIS?: TElementSelector | TElementSelector[];
    T?: TElementSelector | TElementSelector[];

    INHERITS?: TInheritSelector | TInheritSelector[];
    I?: TInheritSelector | TInheritSelector[];

    STEP?: string | string[];
    S?: string | string[];

    // *** PLUGINS OPTIONS ***

    ITEM?: TPropertyBoolValue;

    LAYOUT?: TLayout;
    L?: TLayout;

    AREA?: TArea;
    A?: TArea;

    H?: string;
    V?: string;
}