
import { decorator } from '../utils/base'
import './styles/div';
import name from './names/div';

export default (...children: any) => <HTMLDivElement><unknown>decorator(name, children);
