
import decorator from '../utils/decorator'
import './styles/progress';
import name from './names/progress';

export default (...children: any) => <HTMLProgressElement><unknown>decorator(name, children);
