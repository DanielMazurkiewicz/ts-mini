
import decorator from '../utils/decorator'
import './styles/time';
import name from './names/time';

export default (...children: any) => <HTMLTimeElement><unknown>decorator(name, children);
