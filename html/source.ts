
import decorator from '../utils/decorator'
import './styles/source';
import name from './names/source';

export default (...children: any) => <HTMLSourceElement><unknown>decorator(name, children);
