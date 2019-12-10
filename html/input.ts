
import decorator from '../utils/decorator'
import './styles/input';
import name from './names/input';

export default (...children: any) => <HTMLInputElement><unknown>decorator(name, children);
