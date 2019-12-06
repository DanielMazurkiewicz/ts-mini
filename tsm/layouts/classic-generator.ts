import { tss, layout, IStyleId }from '../../tss/tss'

import headerPlace from '../places/header'
import bodyPlace   from '../places/body'
import footerPlace from '../places/footer'
import leftPlace   from '../places/left'
import rightPlace  from '../places/right'

const buffer: Record<string, IStyleId> = {};

export default (corners: string) => buffer[corners] ? buffer[corners] : buffer[corners] = tss({
    I: layout(
        [corners[0] === 'h' ? headerPlace : leftPlace,  headerPlace,    corners[1] === 'h' ? headerPlace : rightPlace],
        [leftPlace,                                     bodyPlace,      rightPlace],
        [corners[2] === 'f' ? footerPlace : leftPlace,  footerPlace,    corners[3] === 'f' ? footerPlace : rightPlace],
    ),

    grid_template_columns: `auto 1fr auto`,
    grid_template_rows: `auto 1fr auto`,
    justify_items: `center`,
    align_items: `start`
});

