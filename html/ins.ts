
import { decorator } from '../utils/base'
import './styles/ins';
import name from './names/ins';

export default (...children: any) => <HTMLModElement><unknown>decorator(name, children);
