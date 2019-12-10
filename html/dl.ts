
import decorator from '../utils/decorator'
import './styles/dl';
import name from './names/dl';

export default (...children: any) => <HTMLDListElement><unknown>decorator(name, children);
