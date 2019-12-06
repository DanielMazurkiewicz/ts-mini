
import { decorator } from '../utils/base'
import './styles/marquee';
import name from './names/marquee';

export default (...children: any) => <HTMLMarqueeElement><unknown>decorator(name, children);
