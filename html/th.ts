
import decorator from '../utils/decorator'
import './styles/th';
import name from './names/th';

export default (...children: any) => <HTMLTableCellElement><unknown>decorator(name, children);
