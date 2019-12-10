
import decorator from '../utils/decorator'
import './styles/option';
import name from './names/option';

export default (...children: any) => <HTMLOptionElement><unknown>decorator(name, children);
