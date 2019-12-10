
import decorator from '../utils/decorator'
import './styles/dir';
import name from './names/dir';

export default (...children: any) => <HTMLDirectoryElement><unknown>decorator(name, children);
