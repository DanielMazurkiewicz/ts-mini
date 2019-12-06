
import { decorator } from '../utils/base'
import './styles/object';
import name from './names/object';

export default (...children: any) => <HTMLObjectElement><unknown>decorator(name, children);
