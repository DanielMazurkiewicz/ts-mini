
import decorator from '../utils/decorator'
import './styles/area';
import name from './names/area';

export default (...children: any) => <HTMLAreaElement><unknown>decorator(name, children);
