
import decorator from '../utils/decorator'
import './styles/tbody';
import name from './names/tbody';

export default (...children: any) => <HTMLTableSectionElement><unknown>decorator(name, children);
