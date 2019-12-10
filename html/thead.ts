
import decorator from '../utils/decorator'
import './styles/thead';
import name from './names/thead';

export default (...children: any) => <HTMLTableSectionElement><unknown>decorator(name, children);
