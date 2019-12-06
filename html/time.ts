
import { decorator } from '../utils/base'
import './styles/time';
import name from './names/time';

export default (...children: any) => <HTMLTimeElement><unknown>decorator(name, children);
