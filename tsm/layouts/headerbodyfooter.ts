import { tss, layout, IStyleId }from '../../tss/tss'

import headerPlace from '../places/header'
import bodyPlace   from '../places/body'
import footerPlace from '../places/footer'


const buffer: Record<string, IStyleId> = {};

export default (corners: string) => buffer[corners] ? buffer[corners] : buffer[corners] = tss({
    I: layout(
        [headerPlace],
        [bodyPlace],
        [footerPlace],
    ),

    // grid_template_columns: `auto 1fr auto`,
    grid_template_rows: `auto 1fr auto`,
    justify_items: `center`,
    align_items: `start`
});

