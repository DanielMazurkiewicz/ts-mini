
import decorator from '../utils/decorator'
import './styles/del';
import name from './names/del';

export default (...children: any) => <HTMLModElement><unknown>decorator(name, children);
