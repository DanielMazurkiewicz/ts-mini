
import { decorator } from '../utils/base'
import './styles/html';
import name from './names/html';

export default (...children: any) => <HTMLHtmlElement><unknown>decorator(name, children);
