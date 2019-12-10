
import decorator from '../utils/decorator'
import './styles/tfoot';
import name from './names/tfoot';

export default (...children: any) => <HTMLTableSectionElement><unknown>decorator(name, children);
