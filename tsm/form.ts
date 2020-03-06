import { tss }from '../tss/tss'
import div from '../html/div'
import { TElementDivMethod } from '../tss/structures/TElementDivMethod'

export default <TElementDivMethod>tss({
    grid_template_columns: `auto auto`,
    grid_auto_flow: `row`,
    align_items: `center`,
    grid_auto_rows: 'max-content'
}, div)