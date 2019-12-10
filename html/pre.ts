
import decorator from '../utils/decorator'
import './styles/pre';
import name from './names/pre';

export default (...children: any) => <HTMLPreElement><unknown>decorator(name, children);
