
import decorator from '../utils/decorator'
import './styles/script';
import name from './names/script';

export default (...children: any) => <HTMLScriptElement><unknown>decorator(name, children);
