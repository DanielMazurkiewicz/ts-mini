
import { decorator } from '../utils/base'
import './styles/h1';
import name from './names/h1';

export default (...children: any) => <HTMLHeadingElement><unknown>decorator(name, children);
