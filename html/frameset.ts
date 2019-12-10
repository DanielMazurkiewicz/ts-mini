
import decorator from '../utils/decorator'
import './styles/frameset';
import name from './names/frameset';

export default (...children: any) => <HTMLFrameSetElement><unknown>decorator(name, children);
