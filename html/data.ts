
import decorator from '../utils/decorator'
import './styles/data';
import name from './names/data';

export default (...children: any) => <HTMLDataElement><unknown>decorator(name, children);
