
import { decorator } from '../utils/base'
import './styles/th';
import name from './names/th';

export default (...children: any) => <HTMLTableCellElement><unknown>decorator(name, children);
