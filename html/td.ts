
import decorator from '../utils/decorator'
import './styles/td';
import name from './names/td';

export default (...children: any) => <HTMLTableCellElement><unknown>decorator(name, children);
