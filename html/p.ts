
import { decorator } from '../utils/base'
import './styles/p';
import name from './names/p';

export default (...children: any) => <HTMLParagraphElement><unknown>decorator(name, children);
