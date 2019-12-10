
import decorator from '../utils/decorator'
import './styles/table';
import name from './names/table';

export default (...children: any) => <HTMLTableElement><unknown>decorator(name, children);
