
import { decorator } from '../utils/base'
import './styles/ol';
import name from './names/ol';

export default (...children: any) => <HTMLOListElement><unknown>decorator(name, children);
