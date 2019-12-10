
import decorator from '../utils/decorator'
import './styles/a';
import name from './names/a';

export default (...children: any) => <HTMLAnchorElement><unknown>decorator(name, children);
