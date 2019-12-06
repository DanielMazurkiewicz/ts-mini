
import { decorator } from '../utils/base'
import './styles/slot';
import name from './names/slot';

export default (...children: any) => <HTMLSlotElement><unknown>decorator(name, children);
