
import decorator from '../utils/decorator'
import './styles/button';
import name from './names/button';

export default (...children: any) => <HTMLButtonElement><unknown>decorator(name, children);
