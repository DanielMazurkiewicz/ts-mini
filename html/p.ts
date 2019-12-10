
import decorator from '../utils/decorator'
import './styles/p';
import name from './names/p';

export default (...children: any) => <HTMLParagraphElement><unknown>decorator(name, children);
