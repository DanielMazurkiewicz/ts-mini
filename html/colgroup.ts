
import { decorator } from '../utils/base'
import './styles/colgroup';
import name from './names/colgroup';

export default (...children: any) => <HTMLTableColElement><unknown>decorator(name, children);
