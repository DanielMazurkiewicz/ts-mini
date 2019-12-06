
import { decorator } from '../utils/base'
import './styles/input';
import name from './names/input';

export default (...children: any) => <HTMLInputElement><unknown>decorator(name, children);
