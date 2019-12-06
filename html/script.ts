
import { decorator } from '../utils/base'
import './styles/script';
import name from './names/script';

export default (...children: any) => <HTMLScriptElement><unknown>decorator(name, children);
