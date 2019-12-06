import { tss } from '../../tss/tss';
import border from './methods/border';
import size from './methods/size';

export default tss({
    E:'div',
    I: border(1, 'red'),
    padding: size(1),
    gap: size(1)
})