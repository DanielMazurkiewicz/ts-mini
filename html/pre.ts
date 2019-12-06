
import { decorator } from '../utils/base'
import './styles/pre';
import name from './names/pre';

export default (...children: any) => <HTMLPreElement><unknown>decorator(name, children);
