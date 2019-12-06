
import { decorator } from '../utils/base'
import './styles/col';
import name from './names/col';

export default (...children: any) => <HTMLTableColElement><unknown>decorator(name, children);
