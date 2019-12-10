
import decorator from '../utils/decorator'
import './styles/span';
import name from './names/span';

export default (...children: any) => <HTMLSpanElement><unknown>decorator(name, children);
