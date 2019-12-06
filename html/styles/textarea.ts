
import { tss } from '../../tss/tss'
import name from '../names/textarea';
import bist from './common/bist';

export default tss({
    E: name,
    I: bist,
    overflow: `auto`
});
