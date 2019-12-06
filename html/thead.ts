
import { decorator } from '../utils/base'
import './styles/thead';
import name from './names/thead';

export default (...children: any) => <HTMLTableSectionElement><unknown>decorator(name, children);
