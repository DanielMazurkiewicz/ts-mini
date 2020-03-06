import { tss } from '../tss/tss';
import border from '../tss/decor/border';
import size from '../tss/decor/size';

export default tss({
    E:'div',
    I: border(1, 'red'),
    padding: size(1),
    gap: size(1)
})