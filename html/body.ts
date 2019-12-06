
import { decorator } from '../utils/base'
import './styles/body';
import name from './names/body';

export default (...children: any) => <HTMLBodyElement><unknown>decorator(name, children);
