
import decorator from '../utils/decorator'
import './styles/html';
import name from './names/html';

export default (...children: any) => <HTMLHtmlElement><unknown>decorator(name, children);
