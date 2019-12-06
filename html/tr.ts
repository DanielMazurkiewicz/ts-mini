
import { decorator } from '../utils/base'
import './styles/tr';
import name from './names/tr';

export default (...children: any) => <HTMLTableRowElement><unknown>decorator(name, children);
