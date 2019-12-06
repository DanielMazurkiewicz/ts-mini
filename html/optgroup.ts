
import { decorator } from '../utils/base'
import './styles/optgroup';
import name from './names/optgroup';

export default (...children: any) => <HTMLOptGroupElement><unknown>decorator(name, children);
