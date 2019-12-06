
import { decorator } from '../utils/base'
import './styles/area';
import name from './names/area';

export default (...children: any) => <HTMLAreaElement><unknown>decorator(name, children);
