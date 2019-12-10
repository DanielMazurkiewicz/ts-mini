
import decorator from '../utils/decorator'
import './styles/marquee';
import name from './names/marquee';

export default (...children: any) => <HTMLMarqueeElement><unknown>decorator(name, children);
