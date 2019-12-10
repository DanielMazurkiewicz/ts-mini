
import decorator from '../utils/decorator'
import './styles/ol';
import name from './names/ol';

export default (...children: any) => <HTMLOListElement><unknown>decorator(name, children);
