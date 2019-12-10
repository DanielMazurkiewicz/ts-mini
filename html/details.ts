
import decorator from '../utils/decorator'
import './styles/details';
import name from './names/details';

export default (...children: any) => <HTMLDetailsElement><unknown>decorator(name, children);
