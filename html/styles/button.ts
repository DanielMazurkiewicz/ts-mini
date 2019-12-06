
import { tss } from '../../tss/tss'
import name from '../names/button';
import bist from './common/bist';
import bi from './common/bi';
import bs from './common/bs';
import biBrs from './common/bi-brs';
import biBrsMfi from './common/bi-brs-mfi';
import biBrsMf from './common/bi-brs-mf';

export default tss(
    {
        E: name,
        I: [bist, bi, bs, biBrs]
    },
    {
        E: name + `::-moz-focus-inner`,
        I: biBrsMfi
    },
    {
        E: name + `:-moz-focusring`,
        I: biBrsMf
    },
);
