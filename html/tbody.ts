
import { decorator } from '../utils/base'
import './styles/tbody';
import name from './names/tbody';

export default (...children: any) => <HTMLTableSectionElement><unknown>decorator(name, children);
