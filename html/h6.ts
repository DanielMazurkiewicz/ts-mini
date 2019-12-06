
import { decorator } from '../utils/base'
import './styles/h6';
import name from './names/h6';

export default (...children: any) => <HTMLHeadingElement><unknown>decorator(name, children);
