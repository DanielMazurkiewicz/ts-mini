
import decorator from '../utils/decorator'
import './styles/iframe';
import name from './names/iframe';

export default (...children: any) => <HTMLIFrameElement><unknown>decorator(name, children);
