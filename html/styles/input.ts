
import { tss } from '../../tss/tss'
import name from '../names/input';
import button from '../names/button';

import bist from './common/bist';
import bi from './common/bi';
import biBrsMf from './common/bi-brs-mf';
import biBrs from './common/bi-brs';
import biBrsMfi from './common/bi-brs-mfi';

export default tss(
    {
        E: name,
        I: [bist, bi]
    },
    {
        E: `[type="button"],[type="reset"],[type="submit"]`,
        I: biBrs
    },
    {
        E: `[type="button"]::-moz-focus-inner,[type="reset"]::-moz-focus-inner,[type="submit"]::-moz-focus-inner`,
        I: biBrsMfi
    },
    {
        E: `[type="button"]:-moz-focusring,[type="reset"]:-moz-focusring,[type="submit"]:-moz-focusring`,
        I: biBrsMf
    },



    
    {
        E: `[type="checkbox"],[type="radio"]`,
        box_sizing: `border-box`,
        padding: `0`
    },

    {
        E: `[type="number"]::-webkit-inner-spin-button,[type="number"]::-webkit-outer-spin-button`,
        height: 'auto'
    },

    {
        E: `[type="search"]`,
        _webkit_appearance: `textfield`,
        outline_offset: `-2px`
    },

    {
        E: `[type="search"]::-webkit-search-decoration`,
        _webkit_appearance: `none`,
    },

    {
        E: `::-webkit-file-upload-button`,
        _webkit_appearance: button,
        font: `inherit`
    },
);
