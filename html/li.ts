
import decorator from '../utils/decorator'
import './styles/li';
import name from './names/li';

export default (...children: any) => <HTMLLIElement><unknown>decorator(name, children);
