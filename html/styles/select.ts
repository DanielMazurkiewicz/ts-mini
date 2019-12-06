
import { tss } from '../../tss/tss'
import name from '../names/select';
import bist from './common/bist';
import bs from './common/bs';

export default tss({
    E: name,
    I: [bist, bs]
});
