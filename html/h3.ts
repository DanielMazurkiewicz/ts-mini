
import { decorator } from '../utils/base'
import './styles/h3';
import name from './names/h3';

export default (...children: any) => <HTMLHeadingElement><unknown>decorator(name, children);
