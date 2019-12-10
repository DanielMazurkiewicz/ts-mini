
import decorator from '../utils/decorator'
import './styles/optgroup';
import name from './names/optgroup';

export default (...children: any) => <HTMLOptGroupElement><unknown>decorator(name, children);
