
import decorator from '../utils/decorator'
import './styles/body';
import name from './names/body';

export default (...children: any) => <HTMLBodyElement><unknown>decorator(name, children);
