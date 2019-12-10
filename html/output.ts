
import decorator from '../utils/decorator'
import './styles/output';
import name from './names/output';

export default (...children: any) => <HTMLOutputElement><unknown>decorator(name, children);
