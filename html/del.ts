
import { decorator } from '../utils/base'
import './styles/del';
import name from './names/del';

export default (...children: any) => <HTMLModElement><unknown>decorator(name, children);
